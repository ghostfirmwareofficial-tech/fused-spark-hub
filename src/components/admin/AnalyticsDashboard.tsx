import { motion } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Award,
  Activity,
  UserPlus,
  Heart
} from 'lucide-react';
import BubbleCard from '@/components/ui/BubbleCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <span className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </motion.div>
  );
}

export default function AnalyticsDashboard() {
  // Fetch analytics data
  const { data: stats } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const [
        { count: usersCount },
        { count: postsCount },
        { count: messagesCount },
        { data: pointsData },
        { data: recentUsers },
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('chat_messages').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('fused_points').order('fused_points', { ascending: false }).limit(1),
        supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(7),
      ]);

      const totalPoints = (await supabase.from('profiles').select('fused_points')).data?.reduce((acc, p) => acc + p.fused_points, 0) || 0;

      return {
        totalUsers: usersCount || 0,
        totalPosts: postsCount || 0,
        totalMessages: messagesCount || 0,
        totalPointsDistributed: totalPoints,
        topPoints: pointsData?.[0]?.fused_points || 0,
        newUsersThisWeek: recentUsers?.length || 0,
      };
    },
  });

  const { data: rankDistribution = [] } = useQuery({
    queryKey: ['admin-rank-distribution'],
    queryFn: async () => {
      const { data } = await supabase
        .from('profiles')
        .select('rank');
      
      if (!data) return [];
      
      const counts: Record<string, number> = {};
      data.forEach(p => {
        counts[p.rank] = (counts[p.rank] || 0) + 1;
      });
      
      return Object.entries(counts).map(([rank, count]) => ({ rank, count }));
    },
  });

  return (
    <BubbleCard className="p-6">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-fused-purple" />
        Analytics Dashboard
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="bg-blue-500/20 text-blue-400"
        />
        <StatCard
          icon={<FileText className="w-5 h-5" />}
          label="Total Posts"
          value={stats?.totalPosts || 0}
          color="bg-green-500/20 text-green-400"
        />
        <StatCard
          icon={<MessageSquare className="w-5 h-5" />}
          label="Chat Messages"
          value={stats?.totalMessages || 0}
          color="bg-pink-500/20 text-pink-400"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Total FP Distributed"
          value={(stats?.totalPointsDistributed || 0).toLocaleString()}
          color="bg-yellow-500/20 text-yellow-400"
        />
      </div>

      {/* Rank Distribution */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <h3 className="font-medium mb-4">Rank Distribution</h3>
        <div className="space-y-3">
          {rankDistribution.map((item) => {
            const percentage = stats?.totalUsers ? (item.count / stats.totalUsers) * 100 : 0;
            return (
              <div key={item.rank} className="flex items-center gap-3">
                <span className="w-24 text-sm text-muted-foreground">{item.rank}</span>
                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-fused-purple to-fused-blue rounded-full"
                  />
                </div>
                <span className="w-12 text-sm text-right">{item.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </BubbleCard>
  );
}
