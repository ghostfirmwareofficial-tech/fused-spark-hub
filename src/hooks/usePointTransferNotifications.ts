import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export function usePointTransferNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`point-transfers:receiver:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'point_transfers',
          filter: `receiver_id=eq.${user.id}`,
        },
        async (payload) => {
          const incoming = payload.new as {
            sender_id: string;
            amount: number;
            message: string | null;
          };

          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('ign')
            .eq('user_id', incoming.sender_id)
            .maybeSingle();

          const senderName = senderProfile?.ign || 'Someone';

          toast.success(`You received ${incoming.amount} FP from ${senderName}!`, {
            description: incoming.message || undefined,
            duration: 6000,
          });

          // Refresh cached balance + transfer history
          queryClient.invalidateQueries({ queryKey: ['profile'] });
          queryClient.invalidateQueries({ queryKey: ['point-transfers'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
}
