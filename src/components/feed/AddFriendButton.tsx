import { UserPlus, UserCheck, Clock, UserMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocial } from '@/hooks/useSocial';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface AddFriendButtonProps {
  targetUserId: string;
  className?: string;
  size?: 'sm' | 'default';
}

export default function AddFriendButton({ targetUserId, className, size = 'sm' }: AddFriendButtonProps) {
  const { user } = useAuth();
  const { friendshipStatus, sendFriendRequest, removeFriend } = useSocial(targetUserId);

  if (!user || user.id === targetUserId) return null;

  const handleClick = () => {
    if (friendshipStatus === 'none') {
      sendFriendRequest.mutate(targetUserId);
    } else if (friendshipStatus === 'friends') {
      removeFriend.mutate(targetUserId);
    }
  };

  const getButtonContent = () => {
    switch (friendshipStatus) {
      case 'friends':
        return (
          <>
            <UserCheck className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Friends</span>
          </>
        );
      case 'pending_sent':
        return (
          <>
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Pending</span>
          </>
        );
      case 'pending_received':
        return (
          <>
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Respond</span>
          </>
        );
      default:
        return (
          <>
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline ml-1">Add</span>
          </>
        );
    }
  };

  const getVariant = () => {
    if (friendshipStatus === 'friends') return 'outline';
    if (friendshipStatus === 'pending_sent') return 'ghost';
    return 'default';
  };

  return (
    <Button
      variant={getVariant()}
      size={size}
      onClick={handleClick}
      disabled={friendshipStatus === 'pending_sent' || friendshipStatus === 'pending_received' || sendFriendRequest.isPending}
      className={cn(
        friendshipStatus === 'none' && 'bg-gradient-to-r from-fused-purple to-fused-blue',
        className
      )}
    >
      {getButtonContent()}
    </Button>
  );
}
