import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  senderProfile?: {
    ign: string;
    rank: string;
    avatar_url: string | null;
  };
}

export function useSocial(targetUserId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Check if current user follows target
  const { data: isFollowing } = useQuery({
    queryKey: ['is-following', user?.id, targetUserId],
    queryFn: async () => {
      if (!user || !targetUserId || user.id === targetUserId) return false;
      const { data } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user && !!targetUserId,
  });

  // Check friendship status
  const { data: friendshipStatus } = useQuery({
    queryKey: ['friendship-status', user?.id, targetUserId],
    queryFn: async () => {
      if (!user || !targetUserId || user.id === targetUserId) return null;
      
      // Check if already friends
      const { data: friendship } = await supabase
        .from('friendships')
        .select('id')
        .eq('user_id', user.id)
        .eq('friend_id', targetUserId)
        .maybeSingle();
      
      if (friendship) return 'friends';

      // Check for pending request (sent by current user)
      const { data: sentRequest } = await supabase
        .from('friend_requests')
        .select('id, status')
        .eq('sender_id', user.id)
        .eq('receiver_id', targetUserId)
        .eq('status', 'pending')
        .maybeSingle();
      
      if (sentRequest) return 'pending_sent';

      // Check for pending request (received by current user)
      const { data: receivedRequest } = await supabase
        .from('friend_requests')
        .select('id, status')
        .eq('sender_id', targetUserId)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();
      
      if (receivedRequest) return 'pending_received';

      return 'none';
    },
    enabled: !!user && !!targetUserId,
  });

  // Get followers
  const { data: followers = [] } = useQuery({
    queryKey: ['followers', targetUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_follows')
        .select('follower_id')
        .eq('following_id', targetUserId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!targetUserId,
  });

  // Get following
  const { data: following = [] } = useQuery({
    queryKey: ['following', targetUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', targetUserId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!targetUserId,
  });

  // Get friends
  const { data: friends = [] } = useQuery({
    queryKey: ['friends', targetUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', targetUserId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!targetUserId,
  });

  // Get pending friend requests (received) - fetch profiles separately
  const { data: pendingRequests = [] } = useQuery({
    queryKey: ['pending-friend-requests', user?.id],
    queryFn: async () => {
      const { data: requests, error } = await supabase
        .from('friend_requests')
        .select('*')
        .eq('receiver_id', user!.id)
        .eq('status', 'pending');
      
      if (error) throw error;

      // Fetch profiles for senders
      const senderIds = requests.map(r => r.sender_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, ign, rank, avatar_url')
        .in('user_id', senderIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      return requests.map(request => ({
        ...request,
        senderProfile: profilesMap.get(request.sender_id) || { ign: 'Unknown', rank: 'Recruit', avatar_url: null },
      })) as FriendRequest[];
    },
    enabled: !!user,
  });

  // Follow mutation
  const followUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_follows')
        .insert({ follower_id: user!.id, following_id: userId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-following'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Now following!');
    },
    onError: () => toast.error('Failed to follow user'),
  });

  // Unfollow mutation
  const unfollowUser = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('user_follows')
        .delete()
        .eq('follower_id', user!.id)
        .eq('following_id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['is-following'] });
      queryClient.invalidateQueries({ queryKey: ['followers'] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Unfollowed');
    },
    onError: () => toast.error('Failed to unfollow'),
  });

  // Send friend request
  const sendFriendRequest = useMutation({
    mutationFn: async (receiverId: string) => {
      const { error } = await supabase
        .from('friend_requests')
        .insert({ sender_id: user!.id, receiver_id: receiverId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      toast.success('Friend request sent!');
    },
    onError: () => toast.error('Failed to send friend request'),
  });

  // Accept friend request
  const acceptFriendRequest = useMutation({
    mutationFn: async (senderId: string) => {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('sender_id', senderId)
        .eq('receiver_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      queryClient.invalidateQueries({ queryKey: ['pending-friend-requests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Friend request accepted!');
    },
    onError: () => toast.error('Failed to accept request'),
  });

  // Reject friend request
  const rejectFriendRequest = useMutation({
    mutationFn: async (senderId: string) => {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'rejected', updated_at: new Date().toISOString() })
        .eq('sender_id', senderId)
        .eq('receiver_id', user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      queryClient.invalidateQueries({ queryKey: ['pending-friend-requests'] });
      toast.success('Friend request rejected');
    },
    onError: () => toast.error('Failed to reject request'),
  });

  // Remove friend
  const removeFriend = useMutation({
    mutationFn: async (friendId: string) => {
      // Remove both directions
      await supabase.from('friendships').delete().eq('user_id', user!.id).eq('friend_id', friendId);
      await supabase.from('friendships').delete().eq('user_id', friendId).eq('friend_id', user!.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendship-status'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Friend removed');
    },
    onError: () => toast.error('Failed to remove friend'),
  });

  return {
    isFollowing,
    friendshipStatus,
    followers,
    following,
    friends,
    pendingRequests,
    followUser,
    unfollowUser,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  };
}
