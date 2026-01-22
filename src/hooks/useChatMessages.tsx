import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type Channel = 'general' | 'competitive' | 'content' | 'off-topic';

export interface ChatMessage {
  id: string;
  user_id: string;
  channel: string;
  content: string;
  created_at: string;
  profiles?: {
    ign: string;
    rank: string;
    role: string;
    avatar_url: string | null;
  };
}

export function useChatMessages(channel: Channel) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch messages for channel
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat-messages', channel],
    queryFn: async () => {
      // First get messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel', channel)
        .order('created_at', { ascending: true })
        .limit(100);
      
      if (messagesError) throw messagesError;
      if (!messagesData) return [];

      // Get unique user IDs
      const userIds = [...new Set(messagesData.map(m => m.user_id))];
      
      // Fetch profiles for those users
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, ign, rank, role, avatar_url')
        .in('user_id', userIds);

      // Map profiles to messages
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return messagesData.map(msg => ({
        ...msg,
        profiles: profileMap.get(msg.user_id) || {
          ign: 'Unknown',
          rank: 'Recruit',
          role: 'Member',
          avatar_url: null,
        },
      })) as ChatMessage[];
    },
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const realtimeChannel = supabase
      .channel(`chat-${channel}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel=eq.${channel}`,
        },
        async (payload) => {
          // Fetch profile for the new message
          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id, ign, rank, role, avatar_url')
            .eq('user_id', payload.new.user_id)
            .single();

          const newMessage: ChatMessage = {
            id: payload.new.id,
            user_id: payload.new.user_id,
            channel: payload.new.channel,
            content: payload.new.content,
            created_at: payload.new.created_at,
            profiles: profile || {
              ign: 'Unknown',
              rank: 'Recruit',
              role: 'Member',
              avatar_url: null,
            },
          };

          queryClient.setQueryData<ChatMessage[]>(
            ['chat-messages', channel],
            (old) => [...(old || []), newMessage]
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(realtimeChannel);
    };
  }, [channel, queryClient]);

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          channel,
          content: content.trim(),
        });
      
      if (error) throw error;
    },
    onError: (error) => {
      toast.error('Failed to send message', {
        description: error.message,
      });
    },
  });

  return {
    messages,
    isLoading,
    sendMessage,
  };
}
