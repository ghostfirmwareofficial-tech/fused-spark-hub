import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gaming platform OAuth configuration
const STEAM_API_KEY = Deno.env.get('STEAM_API_KEY') || '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');
    const platform = url.searchParams.get('platform');

    console.log('Gaming OAuth action:', action, 'platform:', platform);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader && action !== 'steam-callback') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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

    // Get Steam auth URL (OpenID)
    if (action === 'steam-auth-url') {
      const origin = req.headers.get('origin') || '';
      const returnTo = `${origin}/auth/steam/callback`;
      
      // Steam uses OpenID 2.0, not OAuth2
      // We'll use a simplified approach where users enter their Steam ID
      return new Response(
        JSON.stringify({ 
          message: 'Steam uses OpenID. Please enter your Steam profile URL or Steam ID.',
          manualEntry: true
        }),
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
