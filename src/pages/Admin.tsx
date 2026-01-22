import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  MessageSquare, 
  Trash2,
  Crown,
  Loader2,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BubbleCard from '@/components/ui/BubbleCard';
import RankBadge from '@/components/ui/RankBadge';
import CommunityStats from '@/components/ui/CommunityStats';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  user_id: string;
  ign: string;
  rank: string;
  role: string;
  fused_points: number;
  created_at: string;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: isAdmin,
  });

  // Delete user messages
  const deleteUserMessages = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('User messages deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete messages', { description: error.message });
    },
  });

  // Promote to moderator
  const promoteUser = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: 'moderator' | 'admin' }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User role updated');
    },
    onError: (error) => {
      toast.error('Failed to update role', { description: error.message });
    },
  });

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-fused-purple" />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const filteredUsers = users.filter(u => 
    u.ign?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-400" />
              Admin <span className="gradient-text">Panel</span>
            </h1>
            <p className="text-muted-foreground mt-1">Manage users and community</p>
          </div>
          <CommunityStats />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-3 gap-4"
        >
          <BubbleCard className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-3 text-fused-purple" />
            <p className="text-3xl font-bold">{users.length}</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
          </BubbleCard>
          <BubbleCard className="p-6 text-center">
            <Crown className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
            <p className="text-3xl font-bold">
              {users.filter(u => u.rank === 'Ascended' || u.rank === 'Fused Core').length}
            </p>
            <p className="text-sm text-muted-foreground">Elite Members</p>
          </BubbleCard>
          <BubbleCard className="p-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-3 text-blue-400" />
            <p className="text-3xl font-bold">
              {users.reduce((acc, u) => acc + (u.fused_points || 0), 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total FP Distributed</p>
          </BubbleCard>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BubbleCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">All Users</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 bg-white/5 w-64"
                />
              </div>
            </div>

            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-fused-purple" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="pb-4 text-muted-foreground font-medium">User</th>
                      <th className="pb-4 text-muted-foreground font-medium">Rank</th>
                      <th className="pb-4 text-muted-foreground font-medium">Points</th>
                      <th className="pb-4 text-muted-foreground font-medium">Joined</th>
                      <th className="pb-4 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((profile) => (
                      <tr key={profile.id} className="group">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-fused-purple/30 flex items-center justify-center">
                              {profile.ign?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="font-medium">{profile.ign}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <RankBadge rank={profile.rank} size="sm" />
                        </td>
                        <td className="py-4 text-fused-purple font-medium">
                          {(profile.fused_points || 0).toLocaleString()} FP
                        </td>
                        <td className="py-4 text-muted-foreground text-sm">
                          {new Date(profile.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => promoteUser.mutate({ userId: profile.user_id, role: 'moderator' })}
                              className="border-fused-purple/30 text-fused-purple hover:bg-fused-purple/10"
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              Mod
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteUserMessages.mutate(profile.user_id)}
                              className="border-destructive/30 text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </BubbleCard>
        </motion.div>
      </div>
    </div>
  );
}
