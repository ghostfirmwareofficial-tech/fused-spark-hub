import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Epic Games OAuth configuration
const EPIC_CLIENT_ID = Deno.env.get('EPIC_GAMES_CLIENT_ID') || '';
const EPIC_CLIENT_SECRET = Deno.env.get('EPIC_GAMES_CLIENT_SECRET') || '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log('Gaming OAuth action:', action);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader && action !== 'epic-callback') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate Epic Games OAuth URL
    if (action === 'epic-auth-url') {
      if (!EPIC_CLIENT_ID) {
        return new Response(
          JSON.stringify({ error: 'Epic Games integration not configured. Please add EPIC_GAMES_CLIENT_ID secret.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const origin = req.headers.get('origin') || 'https://fused-spark-hub.lovable.app';
      const redirectUri = `${origin}/epic-callback`;
      const state = crypto.randomUUID();
      
      // Epic Games OAuth2 authorization URL
      const authUrl = new URL('https://www.epicgames.com/id/authorize');
      authUrl.searchParams.set('client_id', EPIC_CLIENT_ID);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('scope', 'basic_profile');
      authUrl.searchParams.set('state', state);

      return new Response(
        JSON.stringify({ authUrl: authUrl.toString(), state }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle Epic OAuth callback - exchange code for token
    if (action === 'epic-callback') {
      const body = await req.json();
      const { code } = body;

      if (!code) {
        throw new Error('No authorization code provided');
      }

      if (!EPIC_CLIENT_ID || !EPIC_CLIENT_SECRET) {
        throw new Error('Epic Games integration not configured');
      }

      const token = authHeader!.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) {
        throw new Error('Invalid user token');
      }

      const origin = req.headers.get('origin') || 'https://fused-spark-hub.lovable.app';
      const redirectUri = `${origin}/epic-callback`;

      // Exchange code for access token
      const tokenResponse = await fetch('https://api.epicgames.dev/epic/oauth/v2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${EPIC_CLIENT_ID}:${EPIC_CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('Epic token exchange error:', errorText);
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      console.log('Epic token data:', JSON.stringify(tokenData, null, 2));

      // Get user info from Epic
      const accountId = tokenData.account_id || tokenData.sub;
      const displayName = tokenData.displayName || tokenData.preferred_username || accountId;

      if (!accountId) {
        throw new Error('Could not get Epic Games account ID');
      }

      // Update profile with Epic Games ID
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ epic_games_id: accountId })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error('Failed to update profile');
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          accountId,
          displayName,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Manual link - user enters their ID directly
    if (action === 'manual-link') {
      const body = await req.json();
      const { platform: linkPlatform, userId: platformUserId, username } = body;

      const token = authHeader!.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) {
        throw new Error('Invalid user token');
      }

      // Update the profile with the gaming account
      const updateData: Record<string, string | null> = {};
      
      switch (linkPlatform) {
        case 'epic':
          updateData.epic_games_id = username || platformUserId;
          break;
        case 'steam':
          updateData.steam_id = username || platformUserId;
          break;
        case 'riot':
          updateData.riot_id = username || platformUserId;
          break;
        default:
          throw new Error('Invalid platform');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error('Failed to update profile');
      }

      return new Response(
        JSON.stringify({ success: true, platform: linkPlatform }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Unlink gaming account
    if (action === 'unlink') {
      const body = await req.json();
      const { platform: unlinkPlatform } = body;

      const token = authHeader!.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) {
        throw new Error('Invalid user token');
      }

      const updateData: Record<string, null> = {};
      
      switch (unlinkPlatform) {
        case 'epic':
          updateData.epic_games_id = null;
          break;
        case 'steam':
          updateData.steam_id = null;
          break;
        case 'riot':
          updateData.riot_id = null;
          break;
        case 'discord':
          updateData.discord_id = null;
          // @ts-ignore - we know this field exists
          updateData.discord_username = null;
          break;
        default:
          throw new Error('Invalid platform');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error('Failed to unlink account');
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Gaming OAuth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
