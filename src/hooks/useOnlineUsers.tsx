import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface OnlineUser {
  id: string;
  ign?: string;
  online_at: string;
}

export function useOnlineUsers() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [totalMembers, setTotalMembers] = useState(0);

  // Fetch total member count
  useEffect(() => {
    const fetchTotalMembers = async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (!error && count !== null) {
        setTotalMembers(count);
      }
    };

    fetchTotalMembers();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchTotalMembers, 30000);
    return () => clearInterval(interval);
  }, []);

  // Track online presence
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupPresence = async () => {
      channel = supabase.channel('online-users', {
        config: { presence: { key: user?.id || 'anonymous' } }
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState<OnlineUser>();
          const users: OnlineUser[] = [];
          
          Object.values(state).forEach((presences) => {
            presences.forEach((presence) => {
              users.push(presence);
            });
          });
          
          setOnlineUsers(users);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && user) {
            await channel.track({
              id: user.id,
              online_at: new Date().toISOString(),
            });
          }
        });
    };

    setupPresence();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user]);

  return {
    onlineUsers,
    onlineCount: onlineUsers.length,
    totalMembers,
  };
}
