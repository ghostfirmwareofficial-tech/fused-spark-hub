import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { useEffect } from 'react';

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

  // Subscribe to realtime incoming transfers
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('point-transfers-incoming')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'point_transfers',
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          const newTransfer = payload.new as { sender_id: string; amount: number; message: string | null };
          
          // Fetch sender profile
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('ign')
            .eq('user_id', newTransfer.sender_id)
            .single();

          const senderName = senderProfile?.ign || 'Someone';
          
          toast.success(`💰 You received ${newTransfer.amount} FP from ${senderName}!`, {
            description: newTransfer.message || undefined,
            duration: 6000,
          });

          // Invalidate queries to refresh balance and history
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          queryClient.invalidateQueries({ queryKey: ['point-transfers'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  // Send points using secure DB function
  const sendPoints = useMutation({
    mutationFn: async ({ receiverUserId, amount, message }: TransferInput) => {
      if (!user) throw new Error('Not authenticated');

      // Call the secure database function
      const { data, error } = await supabase.rpc('transfer_fused_points', {
        _receiver_id: receiverUserId,
        _amount: amount,
        _message: message || null,
      });

      if (error) {
        // Extract message from Postgres exception
        const msg = error.message || 'Transfer failed';
        throw new Error(msg);
      }

      // Get receiver name for success message
      const { data: receiverProfile } = await supabase
        .from('profiles')
        .select('ign')
        .eq('user_id', receiverUserId)
        .single();

      return { receiver: receiverProfile?.ign || 'User', amount };
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
