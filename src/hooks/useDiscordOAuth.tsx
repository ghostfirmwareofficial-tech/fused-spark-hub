import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function useDiscordOAuth() {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const connectDiscord = async () => {
    setIsConnecting(true);
    try {
      // Get the auth URL from our edge function
      const { data, error } = await supabase.functions.invoke('discord-oauth', {
        body: null,
        headers: {},
      });

      if (error) {
        // Check if secrets are not configured
        if (error.message?.includes('client_id')) {
          toast({
            title: "Discord not configured",
            description: "Discord OAuth credentials need to be set up. Contact an admin.",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }

      // Get auth URL with action parameter
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discord-oauth?action=get-auth-url`,
        {
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        }
      );

      const urlData = await response.json();
      
      if (urlData.error) {
        throw new Error(urlData.error);
      }

      // Store state for verification
      sessionStorage.setItem('discord_oauth_state', urlData.state);
      
      // Open Discord OAuth in a popup
      const width = 500;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        urlData.authUrl,
        'discord-oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for the callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.data.type === 'discord-oauth-callback') {
          window.removeEventListener('message', handleMessage);
          popup?.close();
          
          if (event.data.code) {
            await handleCallback(event.data.code);
          } else if (event.data.error) {
            toast({
              title: "Connection failed",
              description: event.data.error,
              variant: "destructive",
            });
          }
          setIsConnecting(false);
        }
      };

      window.addEventListener('message', handleMessage);

      // Also handle popup close without completing
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setIsConnecting(false);
        }
      }, 500);

    } catch (error: any) {
      console.error('Discord connect error:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect Discord account",
        variant: "destructive",
      });
      setIsConnecting(false);
    }
  };

  const handleCallback = async (code: string) => {
    try {
      const session = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discord-oauth?action=callback`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Discord connected!",
        description: `Connected as ${data.username}`,
      });

      // Refresh profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });

    } catch (error: any) {
      console.error('Discord callback error:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to complete Discord connection",
        variant: "destructive",
      });
    }
  };

  const disconnectDiscord = async () => {
    try {
      const session = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discord-oauth?action=disconnect`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.data.session?.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Discord disconnected",
        description: "Your Discord account has been unlinked",
      });

      // Refresh profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });

    } catch (error: any) {
      console.error('Discord disconnect error:', error);
      toast({
        title: "Disconnect failed",
        description: error.message || "Failed to disconnect Discord",
        variant: "destructive",
      });
    }
  };

  return {
    connectDiscord,
    disconnectDiscord,
    isConnecting,
  };
}
