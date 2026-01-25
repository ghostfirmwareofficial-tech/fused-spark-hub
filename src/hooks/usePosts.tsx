import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  is_featured: boolean;
  is_pinned: boolean;
  pinned_at: string | null;
  pinned_by: string | null;
  created_at: string;
  profiles?: {
    ign: string;
    rank: string;
    role: string;
    avatar_url: string | null;
  };
}

interface CreatePostInput {
  content: string;
  imageFile?: File;
  videoFile?: File;
}

export function usePosts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all posts
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;

      // Fetch profiles for posts
      const userIds = [...new Set(postsData.map(p => p.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, ign, rank, role, avatar_url')
        .in('user_id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      return postsData.map(post => ({
        ...post,
        profiles: profilesMap.get(post.user_id) || {
          ign: 'Unknown',
          rank: 'Recruit',
          role: 'Member',
          avatar_url: null,
        },
      })) as Post[];
    },
  });

  // Create post with optional media
  const createPost = useMutation({
    mutationFn: async ({ content, imageFile, videoFile }: CreatePostInput) => {
      if (!user) throw new Error('Not authenticated');

      let imageUrl: string | null = null;
      let videoUrl: string | null = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(fileName, imageFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('post-media')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      // Upload video if provided
      if (videoFile) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(fileName, videoFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('post-media')
          .getPublicUrl(fileName);
        
        videoUrl = publicUrl;
      }

      // Create post
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          image_url: imageUrl,
          video_url: videoUrl,
        })
        .select()
        .single();

      if (error) throw error;

      // Award points for posting - get current points and increment
      const { data: profile } = await supabase
        .from('profiles')
        .select('fused_points, total_posts')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({ 
            fused_points: profile.fused_points + 25,
            total_posts: profile.total_posts + 1
          })
          .eq('user_id', user.id);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Post created! +25 FP');
    },
    onError: (error) => {
      toast.error('Failed to create post', { description: error.message });
    },
  });

  // Like/unlike post
  const toggleLike = useMutation({
    mutationFn: async (postId: string) => {
      // Get current likes and increment
      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (post) {
        const { error } = await supabase
          .from('posts')
          .update({ likes_count: post.likes_count + 1 })
          .eq('id', postId);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
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
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted');
    },
    onError: () => toast.error('Failed to delete post'),
  });

  return {
    posts,
    isLoading,
    createPost,
    toggleLike,
    deletePost,
  };
}
