import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DISCORD_CLIENT_ID = Deno.env.get('DISCORD_CLIENT_ID') || '';
const DISCORD_CLIENT_SECRET = Deno.env.get('DISCORD_CLIENT_SECRET') || '';
const DISCORD_REDIRECT_URI = Deno.env.get('DISCORD_REDIRECT_URI') || '';

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Get auth URL for Discord OAuth
    if (action === 'get-auth-url') {
      const state = crypto.randomUUID();
      const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI)}&response_type=code&scope=identify&state=${state}`;
      
      return new Response(
        JSON.stringify({ authUrl, state }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Exchange code for token and get user info
    if (action === 'callback') {
      const { code } = await req.json();
      
      if (!code) {
        throw new Error('No authorization code provided');
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
          redirect_uri: DISCORD_REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Token exchange failed:', error);
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      // Get Discord user info
      const userResponse = await fetch('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get Discord user info');
      }

      const discordUser = await userResponse.json();
      
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
        throw new Error('Invalid user token');
      }

      // Update the user's profile with Discord info
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          discord_id: discordUser.id,
          discord_username: `${discordUser.username}${discordUser.discriminator !== '0' ? '#' + discordUser.discriminator : ''}`,
        })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        throw new Error('Failed to update profile');
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          username: discordUser.username,
          discriminator: discordUser.discriminator,
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
      JSON.stringify({ error: 'Invalid action' }),
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
