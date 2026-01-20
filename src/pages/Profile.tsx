import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Edit2,
  Calendar,
  Flame,
  Trophy,
  Heart,
  MessageCircle,
  Zap,
  CheckCircle,
  Gift
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import GlassCard from '@/components/ui/GlassCard';
import RankBadge from '@/components/ui/RankBadge';
import PointsDisplay from '@/components/ui/PointsDisplay';
import { cn } from '@/lib/utils';

const RANK_THRESHOLDS = {
  'Recruit': 0,
  'Grinder': 500,
  'Challenger': 2000,
  'Elite': 5000,
  'Fused Core': 15000,
  'Ascended': 50000
};

const ranks = Object.entries(RANK_THRESHOLDS);

export default function Profile() {
  const [hasCheckedIn, setHasCheckedIn] = useState(false);

  // Mock user profile
  const userProfile = {
    ign: 'ProPlayer99',
    rank: 'Challenger',
    role: 'Member',
    fused_points: 2450,
    total_points_earned: 2450,
    current_streak: 5,
    longest_streak: 12,
    total_posts: 8,
    total_likes_received: 45,
    bio: 'Grinding to become the best. Always looking for duo partners!',
    discord_username: 'proplayer99',
    equipped_items: {
      clan_tag: '[FUSE]',
      badge: '🎯 Grinder',
    },
  };

  const currentRankIndex = ranks.findIndex(([name]) => name === userProfile.rank);
  const nextRank = ranks[currentRankIndex + 1];
  const currentThreshold = RANK_THRESHOLDS[userProfile.rank as keyof typeof RANK_THRESHOLDS];
  const nextThreshold = nextRank ? nextRank[1] : currentThreshold;
  const progressToNext = nextRank 
    ? ((userProfile.total_points_earned - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;

  const handleCheckIn = () => {
    setHasCheckedIn(true);
    // Would normally update the database
  };

  const stats = [
    { label: 'Posts', value: userProfile.total_posts, icon: MessageCircle },
    { label: 'Likes Received', value: userProfile.total_likes_received, icon: Heart },
    { label: 'Current Streak', value: userProfile.current_streak, icon: Flame },
    { label: 'Longest Streak', value: userProfile.longest_streak, icon: Trophy },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <GlassCard className="p-8" glow>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fused-purple to-fused-pink flex items-center justify-center text-3xl font-bold border-4 border-fused-purple/30">
                  {userProfile.ign[0]}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-fused-purple flex items-center justify-center border-2 border-background hover:bg-fused-pink transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-2xl font-bold">
                    {userProfile.equipped_items.clan_tag && (
                      <span className="text-fused-purple">{userProfile.equipped_items.clan_tag} </span>
                    )}
                    {userProfile.ign}
                  </h1>
                  <RankBadge rank={userProfile.rank} />
                </div>
                {userProfile.equipped_items.badge && (
                  <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-sm mb-3">
                    {userProfile.equipped_items.badge}
                  </span>
                )}
                <p className="text-muted-foreground mb-4">{userProfile.bio}</p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <PointsDisplay points={userProfile.fused_points} size="lg" />
                </div>
              </div>

              {/* Daily Check-in */}
              <div className="w-full md:w-auto">
                <GlassCard className="p-4 text-center" hover={false}>
                  <div className="flex items-center gap-2 justify-center mb-3">
                    <Calendar className="w-5 h-5 text-fused-purple" />
                    <span className="font-semibold">Daily Check-in</span>
                  </div>
                  {hasCheckedIn ? (
                    <div className="flex items-center gap-2 justify-center text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>Claimed!</span>
                    </div>
                  ) : (
                    <Button
                      onClick={handleCheckIn}
                      className="w-full bg-gradient-to-r from-fused-purple to-fused-pink hover:opacity-90 text-foreground"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Claim +10 FP
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    🔥 {userProfile.current_streak} day streak!
                  </p>
                </GlassCard>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Rank Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Rank Progress
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current: {userProfile.rank}</span>
                {nextRank && (
                  <span className="text-muted-foreground">Next: {nextRank[0]}</span>
                )}
              </div>
              <Progress value={progressToNext} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-fused-purple font-medium">
                  {userProfile.total_points_earned.toLocaleString()} FP
                </span>
                {nextRank && (
                  <span className="text-muted-foreground">
                    {nextRank[1].toLocaleString()} FP
                  </span>
                )}
              </div>
            </div>

            {/* Rank Tiers Preview */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {ranks.map(([name], index) => (
                  <RankBadge 
                    key={name} 
                    rank={name} 
                    size="sm" 
                  />
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <GlassCard key={stat.label} className="p-6 text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-fused-purple" />
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </GlassCard>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-fused-purple" />
              Quick Actions
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button variant="outline" className="border-fused-purple/30 hover:bg-fused-purple/10">
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <a href="https://discord.gg/fusedupesports" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full border-[#5865F2]/30 text-[#5865F2] hover:bg-[#5865F2]/10">
                  Connect Discord
                </Button>
              </a>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
