import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Crown,
  Loader2,
  Search,
  Trophy
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import BubbleCard from '@/components/ui/BubbleCard';
import RankBadge from '@/components/ui/RankBadge';
import CommunityStats from '@/components/ui/CommunityStats';
import ModerationPanel from '@/components/admin/ModerationPanel';
import ContentModeration from '@/components/admin/ContentModeration';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import ApplicationsManagement from '@/components/admin/ApplicationsManagement';
import RoleManagement from '@/components/admin/RoleManagement';
import TournamentManagement from '@/components/admin/TournamentManagement';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Shield className="w-8 h-8 text-destructive" />
              Admin <span className="gradient-text">Panel</span>
            </h1>
            <p className="text-muted-foreground mt-1">Full moderation & analytics</p>
          </div>
          <CommunityStats />
        </motion.div>

        {/* Analytics Dashboard */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <AnalyticsDashboard />
        </motion.div>

        {/* Applications Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <ApplicationsManagement />
        </motion.div>

        {/* Tournament Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}>
          <TournamentManagement />
        </motion.div>

        {/* Content Moderation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <ContentModeration />
        </motion.div>

        {/* Role Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <BubbleCard className="p-6">
            <RoleManagement />
          </BubbleCard>
        </motion.div>

        {/* Users Table with Moderation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <BubbleCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-fused-purple" />
                User Management
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 bg-white/5 w-64 border-white/10"
                />
              </div>
            </div>

            {usersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-fused-purple" />
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1fr_300px] gap-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10 text-left">
                        <th className="pb-4 text-muted-foreground font-medium">User</th>
                        <th className="pb-4 text-muted-foreground font-medium">Rank</th>
                        <th className="pb-4 text-muted-foreground font-medium">Points</th>
                        <th className="pb-4 text-muted-foreground font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map((profile) => (
                        <tr 
                          key={profile.id} 
                          className={`group cursor-pointer transition-colors hover:bg-white/5 ${selectedUser?.id === profile.id ? 'bg-fused-purple/10' : ''}`}
                          onClick={() => setSelectedUser(profile)}
                        >
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fused-purple/30 to-fused-blue/30 flex items-center justify-center border border-white/20">
                                {profile.ign?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <span className="font-medium">{profile.ign}</span>
                                {profile.role === 'Admin' && (
                                  <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-destructive/20 text-destructive border border-destructive/30">
                                    <Crown className="w-3 h-3 inline mr-1" />Admin
                                  </span>
                                )}
                              </div>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Selected User Moderation Panel */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  {selectedUser ? (
                    <div className="space-y-4">
                      <div className="text-center pb-4 border-b border-white/10">
                        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-fused-purple/30 to-fused-blue/30 flex items-center justify-center border border-white/20 text-2xl font-bold mb-2">
                          {selectedUser.ign?.[0]?.toUpperCase()}
                        </div>
                        <p className="font-semibold">{selectedUser.ign}</p>
                        <RankBadge rank={selectedUser.rank} size="sm" />
                      </div>
                      <ModerationPanel userId={selectedUser.user_id} userIgn={selectedUser.ign} />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Select a user to moderate</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </BubbleCard>
        </motion.div>
      </div>
    </div>
  );
}
