import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type ModerationActionType = 'ban' | 'timeout' | 'restrict' | 'kick' | 'warn';

interface ModerationAction {
  id: string;
  user_id: string;
  action_type: ModerationActionType;
  reason: string | null;
  moderator_id: string;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

interface ModerationInput {
  userId: string;
  actionType: ModerationActionType;
  reason?: string;
  durationMinutes?: number;
}

interface MessageWithProfile {
  id: string;
  user_id: string;
  content: string;
  channel: string;
  created_at: string;
  profile?: {
    ign: string;
    rank: string;
    role: string;
  };
}

interface PostWithProfile {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  profile?: {
    ign: string;
    rank: string;
    role: string;
  };
}

export function useModeration() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all moderation actions
  const { data: moderationActions = [], isLoading } = useQuery({
    queryKey: ['moderation-actions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_moderation')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ModerationAction[];
    },
  });

  // Get active moderation for a specific user
  const getUserModeration = (userId: string) => {
    return moderationActions.filter(
      action => action.user_id === userId && action.is_active && 
      (!action.expires_at || new Date(action.expires_at) > new Date())
    );
  };

  // Apply moderation action
  const applyModeration = useMutation({
    mutationFn: async ({ userId, actionType, reason, durationMinutes }: ModerationInput) => {
      const expiresAt = durationMinutes 
        ? new Date(Date.now() + durationMinutes * 60 * 1000).toISOString()
        : null;

      const { error } = await supabase
        .from('user_moderation')
        .insert({
          user_id: userId,
          action_type: actionType,
          reason,
          moderator_id: user!.id,
          expires_at: expiresAt,
        });
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['moderation-actions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success(`User ${variables.actionType}ned successfully`);
    },
    onError: () => toast.error('Failed to apply moderation action'),
  });

  // Revoke moderation action
  const revokeModeration = useMutation({
    mutationFn: async (actionId: string) => {
      const { error } = await supabase
        .from('user_moderation')
        .update({ is_active: false })
        .eq('id', actionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation-actions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Moderation action revoked');
    },
    onError: () => toast.error('Failed to revoke action'),
  });

  // Get all chat messages (admin only) - fetch profiles separately
  const { data: allMessages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['admin-all-messages'],
    queryFn: async () => {
      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;

      // Fetch profiles for messages
      const userIds = [...new Set(messages.map(m => m.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, ign, rank, role')
        .in('user_id', userIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return messages.map(msg => ({
        ...msg,
        profile: profilesMap.get(msg.user_id) || { ign: 'Unknown', rank: 'Recruit', role: 'Member' },
      })) as MessageWithProfile[];
    },
  });

  // Get all posts (admin only) - fetch profiles separately
  const { data: allPosts = [], isLoading: postsLoading } = useQuery({
    queryKey: ['admin-all-posts'],
    queryFn: async () => {
      const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;

      // Fetch profiles for posts
      const userIds = [...new Set(posts.map(p => p.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, ign, rank, role')
        .in('user_id', userIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return posts.map(post => ({
        ...post,
        profile: profilesMap.get(post.user_id) || { ign: 'Unknown', rank: 'Recruit', role: 'Member' },
      })) as PostWithProfile[];
    },
  });

  // Delete message
  const deleteMessage = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-messages'] });
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      toast.success('Message deleted');
    },
    onError: () => toast.error('Failed to delete message'),
  });

  // Delete post
  const deletePost = useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-all-posts'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted');
    },
    onError: () => toast.error('Failed to delete post'),
  });

  return {
    moderationActions,
    isLoading,
    getUserModeration,
    applyModeration,
    revokeModeration,
    allMessages,
    messagesLoading,
    allPosts,
    postsLoading,
    deleteMessage,
    deletePost,
  };
}
