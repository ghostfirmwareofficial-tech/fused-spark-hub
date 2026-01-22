import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

type GamingPlatform = 'epic' | 'steam' | 'riot';

export function useGamingAccounts() {
  const [isConnecting, setIsConnecting] = useState<GamingPlatform | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const connectAccount = async (platform: GamingPlatform, username: string) => {
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
    disconnectAccount,
    isConnecting,
  };
}
