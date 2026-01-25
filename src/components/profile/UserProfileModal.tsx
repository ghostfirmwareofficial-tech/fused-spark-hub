import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import RankBadge from '@/components/ui/RankBadge';
import AddFriendButton from '@/components/feed/AddFriendButton';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, 
  Heart, 
  FileText, 
  Calendar,
  CheckCircle,
  Gamepad2
} from 'lucide-react';
import { format } from 'date-fns';

interface UserProfile {
  id: string;
  user_id: string;
  ign: string;
  rank: string;
  role: string;
  avatar_url: string | null;
  bio: string | null;
  fused_points: number;
  total_posts: number;
  total_likes_received: number;
  followers_count: number;
  following_count: number;
  friends_count: number;
  created_at: string;
  discord_username: string | null;
  epic_games_id: string | null;
  steam_id: string | null;
  riot_id: string | null;
}

interface UserProfileModalProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserProfileModal({ userId, open, onOpenChange }: UserProfileModalProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && open) {
      fetchProfile();
    }
  }, [userId, open]);

  const fetchProfile = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Staff': 'bg-destructive/20 text-destructive border-destructive/30',
      'Admin': 'bg-destructive/20 text-destructive border-destructive/30',
      'Competitive': 'bg-fused-blue/20 text-fused-blue border-fused-blue/30',
      'Creator': 'bg-fused-purple/20 text-fused-purple border-fused-purple/30',
      'Member': 'bg-muted text-muted-foreground border-muted'
    };
    return colors[role] || 'bg-muted text-muted-foreground border-muted';
  };

  const isOwnProfile = user?.id === userId;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">User Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-fused-purple border-t-transparent rounded-full" />
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20 border-2 border-fused-purple/50">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-fused-purple/30 to-fused-blue/30 text-2xl">
                  {profile.ign[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold">{profile.ign}</h3>
                  {profile.role === 'Admin' && (
                    <CheckCircle className="w-5 h-5 text-fused-purple" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <RankBadge rank={profile.rank} size="sm" />
                  <Badge className={getRoleColor(profile.role)} variant="outline">
                    {profile.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-muted-foreground text-sm">{profile.bio}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 bg-white/5 rounded-xl p-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-fused-purple mb-1">
                  <Trophy className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold">{profile.fused_points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Points</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-fused-blue mb-1">
                  <FileText className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold">{profile.total_posts}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-destructive mb-1">
                  <Heart className="w-4 h-4" />
                </div>
                <p className="text-lg font-bold">{profile.total_likes_received}</p>
                <p className="text-xs text-muted-foreground">Likes</p>
              </div>
            </div>

            {/* Social stats */}
            <div className="flex justify-center gap-6 text-sm">
              <div className="text-center">
                <p className="font-semibold">{profile.followers_count}</p>
                <p className="text-muted-foreground">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{profile.following_count}</p>
                <p className="text-muted-foreground">Following</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">{profile.friends_count}</p>
                <p className="text-muted-foreground">Friends</p>
              </div>
            </div>

            {/* Connected accounts */}
            {(profile.discord_username || profile.epic_games_id || profile.steam_id || profile.riot_id) && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-fused-purple" />
                  Connected Accounts
                </h4>
                <div className="flex flex-wrap gap-2">
                  {profile.discord_username && (
                    <Badge variant="outline" className="bg-[#5865F2]/20 text-[#5865F2] border-[#5865F2]/30">
                      Discord: {profile.discord_username}
                    </Badge>
                  )}
                  {profile.epic_games_id && (
                    <Badge variant="outline" className="bg-white/10">
                      Epic: {profile.epic_games_id}
                    </Badge>
                  )}
                  {profile.steam_id && (
                    <Badge variant="outline" className="bg-white/10">
                      Steam: {profile.steam_id}
                    </Badge>
                  )}
                  {profile.riot_id && (
                    <Badge variant="outline" className="bg-[#D32936]/20 text-[#D32936] border-[#D32936]/30">
                      Riot: {profile.riot_id}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Join date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Joined {format(new Date(profile.created_at), 'MMMM yyyy')}
            </div>

            {/* Actions */}
            {!isOwnProfile && user && (
              <div className="flex gap-3">
                <AddFriendButton targetUserId={profile.user_id} className="flex-1" />
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Profile not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
