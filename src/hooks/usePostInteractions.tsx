import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    ign: string;
    avatar_url: string | null;
  };
}

export function usePostInteractions(postId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if user has liked the post
  const { data: hasLiked = false } = useQuery({
    queryKey: ['post-liked', postId, user?.id],
    queryFn: async () => {
      if (!user || !postId) return false;
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!postId,
  });

  // Check if user has reposted
  const { data: hasReposted = false } = useQuery({
    queryKey: ['post-reposted', postId, user?.id],
    queryFn: async () => {
      if (!user || !postId) return false;
      const { data } = await supabase
        .from('reposts')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!postId,
  });

  // Get comments for a post
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      if (!postId) return [];
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;

      const userIds = [...new Set(data.map(c => c.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, ign, avatar_url')
        .in('user_id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      return data.map(comment => ({
        ...comment,
        profiles: profilesMap.get(comment.user_id),
      })) as Comment[];
    },
    enabled: !!postId,
  });

  // Like a post
  const likePost = useMutation({
    mutationFn: async (targetPostId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: targetPostId, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: (_, targetPostId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post-liked', targetPostId] });
    },
  });

  // Unlike a post
  const unlikePost = useMutation({
    mutationFn: async (targetPostId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', targetPostId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: (_, targetPostId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post-liked', targetPostId] });
    },
  });

  // Repost
  const repost = useMutation({
    mutationFn: async (targetPostId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('reposts')
        .insert({ post_id: targetPostId, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: (_, targetPostId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post-reposted', targetPostId] });
      toast.success('Reposted!');
    },
    onError: () => toast.error('Already reposted'),
  });

  // Un-repost
  const unrepost = useMutation({
    mutationFn: async (targetPostId: string) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('reposts')
        .delete()
        .eq('post_id', targetPostId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: (_, targetPostId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post-reposted', targetPostId] });
    },
  });

  // Add comment
  const addComment = useMutation({
    mutationFn: async ({ targetPostId, content }: { targetPostId: string; content: string }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('comments')
        .insert({ post_id: targetPostId, user_id: user.id, content });
      if (error) throw error;
    },
    onSuccess: (_, { targetPostId }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments', targetPostId] });
      toast.success('Comment added');
    },
    onError: (error) => toast.error('Failed to add comment', { description: error.message }),
  });

  // Delete comment
  const deleteComment = useMutation({
    mutationFn: async ({ commentId, targetPostId }: { commentId: string; targetPostId: string }) => {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
      if (error) throw error;
      return targetPostId;
    },
    onSuccess: (targetPostId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['comments', targetPostId] });
    },
  });

  // Pin post (for mods)
  const pinPost = useMutation({
    mutationFn: async ({ targetPostId, pin }: { targetPostId: string; pin: boolean }) => {
      if (!user) throw new Error('Not authenticated');
      const { error } = await supabase
        .from('posts')
        .update({ 
          is_pinned: pin, 
          pinned_at: pin ? new Date().toISOString() : null,
          pinned_by: pin ? user.id : null 
        })
        .eq('id', targetPostId);
      if (error) throw error;
    },
    onSuccess: (_, { pin }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success(pin ? 'Post pinned' : 'Post unpinned');
    },
    onError: () => toast.error('Failed to update pin status'),
  });

  return {
    hasLiked,
    hasReposted,
    comments,
    commentsLoading,
    likePost,
    unlikePost,
    repost,
    unrepost,
    addComment,
    deleteComment,
    pinPost,
  };
}
