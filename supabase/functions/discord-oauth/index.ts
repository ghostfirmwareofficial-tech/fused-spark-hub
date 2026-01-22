import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Discord OAuth configuration
const DISCORD_CLIENT_ID = Deno.env.get('DISCORD_CLIENT_ID') || '';
const DISCORD_CLIENT_SECRET = Deno.env.get('DISCORD_CLIENT_SECRET') || '';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    console.log('Discord OAuth action:', action);

    // Get auth URL for Discord OAuth
    if (action === 'get-auth-url') {
      // Check if Discord is configured
      if (!DISCORD_CLIENT_ID) {
        return new Response(
          JSON.stringify({ 
            error: 'Discord OAuth not configured',
            configured: false 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get the origin from the request for dynamic redirect URI
      const origin = req.headers.get('origin') || req.headers.get('referer')?.replace(/\/$/, '') || '';
      const redirectUri = `${origin}/auth/discord/callback`;
      
      const state = crypto.randomUUID();
      const authUrl = new URL('https://discord.com/api/oauth2/authorize');
      authUrl.searchParams.set('client_id', DISCORD_CLIENT_ID);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', 'identify');
      authUrl.searchParams.set('state', state);
      
      console.log('Generated auth URL:', authUrl.toString());
      console.log('Redirect URI:', redirectUri);
      
      return new Response(
        JSON.stringify({ 
          authUrl: authUrl.toString(), 
          state,
          configured: true,
          redirectUri 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Exchange code for token and get user info
    if (action === 'callback') {
      const body = await req.json();
      const { code, redirectUri } = body;
      
      console.log('Callback received with code:', code ? 'present' : 'missing');
      console.log('Redirect URI:', redirectUri);
      
      if (!code) {
        throw new Error('No authorization code provided');
      }

      if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
        throw new Error('Discord OAuth not configured');
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
      });

      const tokenText = await tokenResponse.text();
      console.log('Token response status:', tokenResponse.status);
      
      if (!tokenResponse.ok) {
        console.error('Token exchange failed:', tokenText);
        throw new Error('Failed to exchange code for token: ' + tokenText);
      }

      const tokenData = JSON.parse(tokenText);
      const accessToken = tokenData.access_token;

      // Get Discord user info
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        const userError = await userResponse.text();
        console.error('User fetch failed:', userError);
        throw new Error('Failed to get Discord user info');
      }

      const discordUser = await userResponse.json();
      console.log('Discord user fetched:', discordUser.username);
      
      // Get the Supabase user from the auth header
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        throw new Error('No authorization header');
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Get user from JWT
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) {
        console.error('Auth error:', userError);
        throw new Error('Invalid user token');
      }

      // Format username (Discord removed discriminators for most users)
      const discordUsername = discordUser.discriminator && discordUser.discriminator !== '0' 
        ? `${discordUser.username}#${discordUser.discriminator}`
        : discordUser.username;

      // Update the user's profile with Discord info
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          discord_id: discordUser.id,
          discord_username: discordUsername,
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error('Failed to update profile');
      }

      console.log('Profile updated successfully for user:', user.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          username: discordUsername,
          id: discordUser.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Disconnect Discord
    if (action === 'disconnect') {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader) {
        throw new Error('No authorization header');
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !user) {
        throw new Error('Invalid user token');
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          discord_id: null,
          discord_username: null,
        })
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error('Failed to disconnect Discord');
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use: get-auth-url, callback, or disconnect' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Discord OAuth error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
