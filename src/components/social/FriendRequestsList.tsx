import { motion } from 'framer-motion';
import { Check, X, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSocial } from '@/hooks/useSocial';
import RankBadge from '@/components/ui/RankBadge';

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  senderProfile?: {
    ign: string;
    rank: string;
    avatar_url: string | null;
  };
}

export default function FriendRequestsList() {
  const { pendingRequests, acceptFriendRequest, rejectFriendRequest } = useSocial();

  // Type assertion to handle the joined data
  const requests = pendingRequests as FriendRequest[];

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No pending friend requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request, index) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fused-purple/30 to-fused-blue/30 flex items-center justify-center border border-white/20">
              {request.senderProfile?.avatar_url ? (
                <img 
                  src={request.senderProfile.avatar_url} 
                  alt="" 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <span className="text-fused-purple font-semibold">
                  {request.senderProfile?.ign?.[0]?.toUpperCase() || '?'}
                </span>
              )}
            </div>
            <div>
              <p className="font-medium">{request.senderProfile?.ign || 'Unknown'}</p>
              <RankBadge rank={request.senderProfile?.rank || 'Recruit'} size="sm" showLabel={false} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => acceptFriendRequest.mutate(request.sender_id)}
              disabled={acceptFriendRequest.isPending}
              className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
            >
              <Check className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => rejectFriendRequest.mutate(request.sender_id)}
              disabled={rejectFriendRequest.isPending}
              className="border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
