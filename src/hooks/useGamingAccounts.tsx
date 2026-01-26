import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

type GamingPlatform = 'epic' | 'steam' | 'riot';

export function useGamingAccounts() {
  const [isConnecting, setIsConnecting] = useState<GamingPlatform | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Listen for Epic OAuth callback messages
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data?.type === 'epic-oauth-callback') {
        if (event.data.error) {
          toast({
            title: "Epic Games connection failed",
            description: event.data.error,
            variant: "destructive",
          });
          setIsConnecting(null);
          return;
        }

        if (event.data.code) {
          try {
            const session = await supabase.auth.getSession();
            if (!session.data.session) {
              throw new Error('Not logged in');
            }

            // Exchange code for account info
            const response = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gaming-oauth?action=epic-callback`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${session.data.session.access_token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: event.data.code }),
              }
            );

            const data = await response.json();
            
            if (data.error) {
              throw new Error(data.error);
            }

            toast({
              title: "Epic Games connected!",
              description: `Linked as ${data.displayName || data.accountId}`,
            });

            queryClient.invalidateQueries({ queryKey: ['profile'] });
          } catch (error) {
            console.error('Epic OAuth callback error:', error);
            toast({
              title: "Connection failed",
              description: error instanceof Error ? error.message : 'Failed to connect Epic Games',
              variant: "destructive",
            });
          }
          setIsConnecting(null);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast, queryClient]);

  const connectEpicGames = async () => {
    setIsConnecting('epic');
    
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        toast({
          title: "Not logged in",
          description: "Please log in to connect your Epic Games account.",
          variant: "destructive",
        });
        setIsConnecting(null);
        return;
      }

      // Get Epic OAuth URL from edge function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gaming-oauth?action=epic-auth-url`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.data.session.access_token}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.authUrl) {
        // Store state for verification
        sessionStorage.setItem('epic_oauth_state', data.state);
        
        // Open popup for Epic OAuth
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        window.open(
          data.authUrl,
          'Epic Games Login',
          `width=${width},height=${height},left=${left},top=${top}`
        );
      } else {
        throw new Error('Failed to get Epic auth URL');
      }
    } catch (error) {
      console.error('Epic OAuth error:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : 'Failed to start Epic Games login',
        variant: "destructive",
      });
      setIsConnecting(null);
    }
  };

  const connectAccount = async (platform: GamingPlatform, username: string) => {
    // For Epic Games, use OAuth flow instead
    if (platform === 'epic') {
      await connectEpicGames();
      return true;
    }

    setIsConnecting(platform);
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        toast({
          title: "Not logged in",
          description: "Please log in to connect your gaming account.",
          variant: "destructive",
        });
        setIsConnecting(null);
        return false;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gaming-oauth?action=manual-link`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.data.session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ platform, username }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const platformNames: Record<GamingPlatform, string> = {
        epic: 'Epic Games',
        steam: 'Steam',
        riot: 'Riot Games',
      };

      toast({
        title: `${platformNames[platform]} connected!`,
        description: `Linked as ${username}`,
      });

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsConnecting(null);
      return true;

    } catch (error: unknown) {
      console.error('Gaming connect error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect account';
      toast({
        title: "Connection failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsConnecting(null);
      return false;
    }
  };

  const disconnectAccount = async (platform: GamingPlatform | 'discord') => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Not logged in');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gaming-oauth?action=unlink`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.data.session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ platform }),
        }
      );

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Account disconnected",
        description: "Your gaming account has been unlinked",
      });

      queryClient.invalidateQueries({ queryKey: ['profile'] });

    } catch (error: unknown) {
      console.error('Gaming disconnect error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to disconnect account';
      toast({
        title: "Disconnect failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return {
    connectAccount,
    connectEpicGames,
    disconnectAccount,
    isConnecting,
  };
}
