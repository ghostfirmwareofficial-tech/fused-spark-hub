import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

interface TransferInput {
  receiverUserId: string;
  amount: number;
  message?: string;
}

export function usePointTransfer() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();

  // Get transfer history
  const { data: transfers = [], isLoading } = useQuery({
    queryKey: ['point-transfers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('point_transfers')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      // Fetch profiles for senders/receivers
      const userIds = [...new Set([...data.map(t => t.sender_id), ...data.map(t => t.receiver_id)])];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, ign, avatar_url')
        .in('user_id', userIds);
      
      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      
      return data.map(transfer => ({
        ...transfer,
        sender: profileMap.get(transfer.sender_id),
        receiver: profileMap.get(transfer.receiver_id),
      }));
    },
    enabled: !!user,
  });

  // Send points to another user
  const sendPoints = useMutation({
    mutationFn: async ({ receiverUserId, amount, message }: TransferInput) => {
      if (!user || !profile) throw new Error('Not authenticated');
      if (receiverUserId === user.id) throw new Error('Cannot send points to yourself');
      if (amount <= 0) throw new Error('Amount must be positive');
      if (profile.fused_points < amount) throw new Error('Insufficient points');

      // Check receiver exists and get current balance
      const { data: receiver, error: receiverError } = await supabase
        .from('profiles')
        .select('user_id, ign, fused_points')
        .eq('user_id', receiverUserId)
        .single();
      
      if (receiverError || !receiver) throw new Error('User not found');

      // Get sender's current balance to ensure we have the latest
      const { data: currentSender, error: senderFetchError } = await supabase
        .from('profiles')
        .select('fused_points')
        .eq('user_id', user.id)
        .single();
      
      if (senderFetchError || !currentSender) throw new Error('Could not verify balance');
      if (currentSender.fused_points < amount) throw new Error('Insufficient points');

      // Log the transfer first (this validates RLS)
      const { error: transferError } = await supabase
        .from('point_transfers')
        .insert({
          sender_id: user.id,
          receiver_id: receiverUserId,
          amount,
          message: message || null,
        });
      
      if (transferError) throw transferError;

      // Deduct from sender using current balance
      const { error: senderError } = await supabase
        .from('profiles')
        .update({ fused_points: currentSender.fused_points - amount })
        .eq('user_id', user.id);
      
      if (senderError) throw senderError;

      // Add to receiver using their current balance
      const { error: receiverUpdateError } = await supabase
        .from('profiles')
        .update({ fused_points: receiver.fused_points + amount })
        .eq('user_id', receiverUserId);
      
      if (receiverUpdateError) throw receiverUpdateError;

      return { receiver: receiver.ign, amount };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['point-transfers'] });
      toast.success(`Sent ${data.amount} FP to ${data.receiver}!`);
    },
    onError: (error) => {
      toast.error('Transfer failed', { description: error.message });
    },
  });

  return {
    transfers,
    isLoading,
    sendPoints,
    currentBalance: profile?.fused_points || 0,
  };
}
