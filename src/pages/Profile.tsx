import { useState, useRef } from 'react';
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
  Gift,
  Camera,
  Save,
  Loader2,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import BubbleCard from '@/components/ui/BubbleCard';
import RankBadge from '@/components/ui/RankBadge';
import PointsDisplay from '@/components/ui/PointsDisplay';
import GamingAccountButton from '@/components/ui/GamingAccountButton';
import GamingConnectionModal from '@/components/profile/GamingConnectionModal';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useUserRole } from '@/hooks/useUserRole';
import { useDailyCheckIn } from '@/hooks/useDailyCheckIn';
import { useDiscordOAuth } from '@/hooks/useDiscordOAuth';
import { useGamingAccounts } from '@/hooks/useGamingAccounts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { isAdmin } = useUserRole();
  const { hasCheckedInToday, currentStreak, checkIn } = useDailyCheckIn();
  const { connectDiscord, disconnectDiscord, isConnecting: isDiscordConnecting } = useDiscordOAuth();
  const { connectAccount, disconnectAccount, isConnecting: gamingConnecting } = useGamingAccounts();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedIgn, setEditedIgn] = useState('');
  const [editedBio, setEditedBio] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [connectionModal, setConnectionModal] = useState<{
    isOpen: boolean;
    platform: 'epic' | 'steam' | 'riot';
  }>({ isOpen: false, platform: 'epic' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update profile mutation
  const updateProfile = useMutation({
    mutationFn: async (data: { ign?: string; bio?: string }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('user_id', user.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      toast.success('Profile updated!');
    },
    onError: (error) => {
      toast.error('Failed to update profile', { description: error.message });
    },
  });

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Avatar updated!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast.error('Failed to upload avatar', { description: errorMessage });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const openConnectionModal = (platform: 'epic' | 'steam' | 'riot') => {
    setConnectionModal({ isOpen: true, platform });
  };

  const handleGamingConnect = async (username: string) => {
    return await connectAccount(connectionModal.platform, username);
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-fused-purple" />
      </div>
    );
  }

  const currentRankIndex = ranks.findIndex(([name]) => name === profile.rank);
  const nextRank = ranks[currentRankIndex + 1];
  const currentThreshold = RANK_THRESHOLDS[profile.rank as keyof typeof RANK_THRESHOLDS] || 0;
  const nextThreshold = nextRank ? nextRank[1] : currentThreshold;
  const progressToNext = nextRank 
    ? ((profile.total_points_earned - currentThreshold) / (nextThreshold - currentThreshold)) * 100
    : 100;

  const stats = [
    { label: 'Posts', value: profile.total_posts || 0, icon: MessageCircle },
    { label: 'Likes Received', value: profile.total_likes_received || 0, icon: Heart },
    { label: 'Current Streak', value: currentStreak, icon: Flame },
    { label: 'Longest Streak', value: profile.longest_streak || 0, icon: Trophy },
  ];

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BubbleCard className="p-8" glow>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Avatar */}
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-fused-blue to-fused-purple flex items-center justify-center text-3xl font-bold border-4 border-fused-purple/30 overflow-hidden">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    profile.ign?.[0]?.toUpperCase() || '?'
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Camera className="w-6 h-6" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2 flex-wrap">
                  {isEditing ? (
                    <Input
                      value={editedIgn}
                      onChange={(e) => setEditedIgn(e.target.value)}
                      className="max-w-[200px] bg-white/5"
                      placeholder="Your IGN"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold">{profile.ign}</h1>
                  )}
                  <RankBadge rank={profile.rank} />
                  {isAdmin && (
                    <span className="admin-badge">
                      <Shield className="w-3 h-3" />
                      ADMIN
                    </span>
                  )}
                </div>
                
                {isEditing ? (
                  <Textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="bg-white/5 mb-3"
                    placeholder="Your bio..."
                    rows={2}
                  />
                ) : (
                  <p className="text-muted-foreground mb-4">{profile.bio || 'No bio yet...'}</p>
                )}
                
                <div className="flex items-center justify-center md:justify-start gap-4">
                  <PointsDisplay points={profile.fused_points || 0} size="lg" />
                  
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateProfile.mutate({ ign: editedIgn, bio: editedBio })}
                        disabled={updateProfile.isPending}
                        className="bg-fused-purple hover:bg-fused-purple/80"
                      >
                        {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditedIgn(profile.ign || '');
                        setEditedBio(profile.bio || '');
                        setIsEditing(true);
                      }}
                      className="border-fused-purple/30"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              {/* Daily Check-in */}
              <div className="w-full md:w-auto">
                <BubbleCard className="p-4 text-center">
                  <div className="flex items-center gap-2 justify-center mb-3">
                    <Calendar className="w-5 h-5 text-fused-purple" />
                    <span className="font-semibold">Daily Check-in</span>
                  </div>
                  {hasCheckedInToday ? (
                    <div className="flex items-center gap-2 justify-center text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span>Claimed!</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => checkIn.mutate()}
                      disabled={checkIn.isPending}
                      className="w-full bg-gradient-to-r from-fused-blue to-fused-purple hover:opacity-90 text-foreground"
                    >
                      {checkIn.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          Claim +{10 + Math.min(currentStreak * 2, 50)} FP
                        </>
                      )}
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    🔥 {currentStreak} day streak!
                  </p>
                </BubbleCard>
              </div>
            </div>
          </BubbleCard>
        </motion.div>

        {/* Gaming Connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BubbleCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-fused-purple" />
              Connected Accounts
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <GamingAccountButton
                platform="epic"
                isConnected={!!profile.epic_games_id}
                username={profile.epic_games_id || undefined}
                onConnect={() => openConnectionModal('epic')}
                onDisconnect={() => disconnectAccount('epic')}
              />
              <GamingAccountButton
                platform="steam"
                isConnected={!!profile.steam_id}
                username={profile.steam_id || undefined}
                onConnect={() => openConnectionModal('steam')}
                onDisconnect={() => disconnectAccount('steam')}
              />
              <GamingAccountButton
                platform="riot"
                isConnected={!!profile.riot_id}
                username={profile.riot_id || undefined}
                onConnect={() => openConnectionModal('riot')}
                onDisconnect={() => disconnectAccount('riot')}
              />
              <GamingAccountButton
                platform="discord"
                isConnected={!!profile.discord_id}
                username={profile.discord_username || undefined}
                onConnect={connectDiscord}
                onDisconnect={disconnectDiscord}
                isLoading={isDiscordConnecting}
              />
            </div>
          </BubbleCard>
        </motion.div>

        {/* Rank Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BubbleCard className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Rank Progress
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current: {profile.rank}</span>
                {nextRank && (
                  <span className="text-muted-foreground">Next: {nextRank[0]}</span>
                )}
              </div>
              <Progress value={progressToNext} className="h-3" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-fused-purple font-medium">
                  {(profile.total_points_earned || 0).toLocaleString()} FP
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
                {ranks.map(([name]) => (
                  <RankBadge key={name} rank={name} size="sm" />
                ))}
              </div>
            </div>
          </BubbleCard>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <BubbleCard key={stat.label} className="p-6 text-center">
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-fused-purple" />
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </BubbleCard>
          ))}
        </motion.div>
      </div>

      {/* Gaming Connection Modal */}
      <GamingConnectionModal
        isOpen={connectionModal.isOpen}
        onClose={() => setConnectionModal({ ...connectionModal, isOpen: false })}
        platform={connectionModal.platform}
        onConnect={handleGamingConnect}
        isLoading={gamingConnecting === connectionModal.platform}
      />
    </div>
  );
}
