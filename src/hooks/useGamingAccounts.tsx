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

      // Validate username
      const sanitizedUsername = username.trim().slice(0, 50);
      if (!sanitizedUsername || sanitizedUsername.length < 2) {
        toast({
          title: "Invalid username",
          description: "Please enter a valid username (at least 2 characters).",
          variant: "destructive",
        });
        setIsConnecting(null);
        return false;
      }

      // For Epic Games, verify the username works by fetching stats first
      if (platform === 'epic') {
        try {
          const response = await supabase.functions.invoke('fetch-fortnite-stats', {
            body: { username: sanitizedUsername },
          });

          if (response.error) {
            throw new Error(response.error.message || 'Failed to verify username');
          }

          if (response.data?.error) {
            throw new Error(response.data.error);
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to verify Fortnite username';
          toast({
            title: "Verification failed",
            description: errorMessage,
            variant: "destructive",
          });
          setIsConnecting(null);
          return false;
        }
      }

      // Save the username to profile
      const columnMap: Record<GamingPlatform, string> = {
        epic: 'epic_games_id',
        steam: 'steam_id',
        riot: 'riot_id',
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ [columnMap[platform]]: sanitizedUsername })
        .eq('user_id', session.data.session.user.id);

      if (updateError) {
        throw updateError;
      }

      const platformNames: Record<GamingPlatform, string> = {
        epic: 'Epic Games',
        steam: 'Steam',
        riot: 'Riot Games',
      };

      toast({
        title: `${platformNames[platform]} connected!`,
        description: `Linked as ${sanitizedUsername}`,
      });

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['fortnite-stats'] });
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

      const columnMap: Record<string, string> = {
        epic: 'epic_games_id',
        steam: 'steam_id',
        riot: 'riot_id',
        discord: 'discord_id',
      };

      const { error } = await supabase
        .from('profiles')
        .update({ [columnMap[platform]]: null })
        .eq('user_id', session.data.session.user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Account disconnected",
        description: "Your gaming account has been unlinked",
      });

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['fortnite-stats'] });

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
