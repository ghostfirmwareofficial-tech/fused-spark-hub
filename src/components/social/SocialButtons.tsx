import { UserPlus, UserMinus, UserCheck, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocial } from '@/hooks/useSocial';
import { useAuth } from '@/hooks/useAuth';

interface SocialButtonsProps {
  targetUserId: string;
  className?: string;
}

export default function SocialButtons({ targetUserId, className = '' }: SocialButtonsProps) {
  const { user } = useAuth();
  const { 
    isFollowing, 
    friendshipStatus, 
    followUser, 
    unfollowUser, 
    sendFriendRequest,
    removeFriend,
  } = useSocial(targetUserId);

  if (!user || user.id === targetUserId) return null;

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Follow/Unfollow Button */}
      <Button
        size="sm"
        variant={isFollowing ? "outline" : "default"}
        onClick={() => isFollowing ? unfollowUser.mutate(targetUserId) : followUser.mutate(targetUserId)}
        disabled={followUser.isPending || unfollowUser.isPending}
        className={isFollowing 
          ? "border-muted-foreground/30 hover:border-destructive hover:text-destructive" 
          : "bg-gradient-to-r from-fused-purple to-fused-blue hover:opacity-90"
        }
      >
        {isFollowing ? (
          <>
            <UserMinus className="w-4 h-4 mr-1" />
            Unfollow
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-1" />
            Follow
          </>
        )}
      </Button>

      {/* Friend Button */}
      {friendshipStatus === 'friends' ? (
        <Button
          size="sm"
          variant="outline"
          onClick={() => removeFriend.mutate(targetUserId)}
          disabled={removeFriend.isPending}
          className="border-green-500/30 text-green-400 hover:border-destructive hover:text-destructive"
        >
          <UserCheck className="w-4 h-4 mr-1" />
          Friends
        </Button>
      ) : friendshipStatus === 'pending_sent' ? (
        <Button
          size="sm"
          variant="outline"
          disabled
          className="border-yellow-500/30 text-yellow-400"
        >
          <Clock className="w-4 h-4 mr-1" />
          Pending
        </Button>
      ) : friendshipStatus === 'pending_received' ? (
        <Button
          size="sm"
          variant="outline"
          className="border-fused-purple/30 text-fused-purple"
        >
          <Users className="w-4 h-4 mr-1" />
          Respond
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          onClick={() => sendFriendRequest.mutate(targetUserId)}
          disabled={sendFriendRequest.isPending}
          className="border-fused-purple/30 text-fused-purple hover:bg-fused-purple/10"
        >
          <Users className="w-4 h-4 mr-1" />
          Add Friend
        </Button>
      )}
    </div>
  );
}
