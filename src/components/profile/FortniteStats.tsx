import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  Trophy, 
  Target, 
  Skull, 
  Clock, 
  Crown,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import BubbleCard from '@/components/ui/BubbleCard';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface FortniteStatsProps {
  epicUsername: string;
}

interface FortniteStatsData {
  account: {
    name: string;
    level?: number;
  };
  battlePass?: {
    level: number;
    progress: number;
  };
  stats?: {
    all?: {
      overall?: {
        wins: number;
        kills: number;
        deaths: number;
        kd: number;
        matches: number;
        winRate: number;
        minutesPlayed: number;
        top5: number;
        top10: number;
        top25: number;
      };
      solo?: {
        wins: number;
        kills: number;
        kd: number;
        matches: number;
      };
      duo?: {
        wins: number;
        kills: number;
        kd: number;
        matches: number;
      };
      squad?: {
        wins: number;
        kills: number;
        kd: number;
        matches: number;
      };
    };
  };
}

export default function FortniteStats({ epicUsername }: FortniteStatsProps) {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['fortnite-stats', epicUsername],
    queryFn: async (): Promise<FortniteStatsData | null> => {
      const session = await supabase.auth.getSession();
      if (!session.data.session) return null;

      const response = await supabase.functions.invoke('fetch-fortnite-stats', {
        body: { username: epicUsername },
      });

      if (response.error) throw response.error;
      return response.data;
    },
    enabled: !!epicUsername,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 1,
  });

  if (!epicUsername) {
    return null;
  }

  if (isLoading) {
    return (
      <BubbleCard className="p-6">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 animate-spin text-fused-purple" />
          <span className="text-muted-foreground">Loading Fortnite stats...</span>
        </div>
      </BubbleCard>
    );
  }

  if (error || !stats) {
    return (
      <BubbleCard className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Gamepad2 className="w-5 h-5 text-fused-purple" />
          <h3 className="font-semibold">Fortnite Stats</h3>
        </div>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {error ? 'Failed to load stats. Account may be private.' : 'No stats available.'}
          </p>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </BubbleCard>
    );
  }

  const overall = stats.stats?.all?.overall;
  const modes = [
    { name: 'Solo', data: stats.stats?.all?.solo },
    { name: 'Duo', data: stats.stats?.all?.duo },
    { name: 'Squad', data: stats.stats?.all?.squad },
  ].filter(m => m.data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <BubbleCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#9D4DFF] to-[#00D4FF] flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Fortnite Stats</h3>
              <p className="text-sm text-muted-foreground">{stats.account?.name || epicUsername}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        {overall && (
          <>
            {/* Overall Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard 
                icon={Crown} 
                label="Wins" 
                value={overall.wins?.toLocaleString() || '0'} 
                gradient="from-yellow-500/20 to-orange-500/10"
              />
              <StatCard 
                icon={Skull} 
                label="Eliminations" 
                value={overall.kills?.toLocaleString() || '0'} 
                gradient="from-red-500/20 to-pink-500/10"
              />
              <StatCard 
                icon={Target} 
                label="K/D Ratio" 
                value={overall.kd?.toFixed(2) || '0.00'} 
                gradient="from-blue-500/20 to-cyan-500/10"
              />
              <StatCard 
                icon={Trophy} 
                label="Win Rate" 
                value={`${(overall.winRate || 0).toFixed(1)}%`} 
                gradient="from-green-500/20 to-emerald-500/10"
              />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="text-center p-3 rounded-lg bg-white/5">
                <p className="text-2xl font-bold">{overall.matches?.toLocaleString() || '0'}</p>
                <p className="text-xs text-muted-foreground">Matches</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <p className="text-2xl font-bold">{overall.top5?.toLocaleString() || '0'}</p>
                <p className="text-xs text-muted-foreground">Top 5</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-white/5">
                <p className="text-2xl font-bold">{Math.round((overall.minutesPlayed || 0) / 60)}h</p>
                <p className="text-xs text-muted-foreground">Played</p>
              </div>
            </div>
          </>
        )}

        {/* Mode Breakdown */}
        {modes.length > 0 && (
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">By Mode</h4>
            <div className="grid gap-2">
              {modes.map(({ name, data }) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                  <span className="font-medium">{name}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-yellow-400">{data?.wins || 0} wins</span>
                    <span className="text-muted-foreground">{data?.kd?.toFixed(2) || '0.00'} K/D</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </BubbleCard>
    </motion.div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  gradient: string;
}

function StatCard({ icon: Icon, label, value, gradient }: StatCardProps) {
  return (
    <div className={cn(
      "p-4 rounded-xl bg-gradient-to-br border border-white/10",
      gradient
    )}>
      <Icon className="w-5 h-5 mb-2 text-white/70" />
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
