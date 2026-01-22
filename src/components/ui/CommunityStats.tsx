import React from 'react';
import { Users, Wifi } from 'lucide-react';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { cn } from '@/lib/utils';

interface CommunityStatsProps {
  className?: string;
  compact?: boolean;
}

export default function CommunityStats({ className, compact = false }: CommunityStatsProps) {
  const { onlineCount, totalMembers } = useOnlineUsers();

  if (compact) {
    return (
      <div className={cn('flex items-center gap-4 text-sm', className)}>
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-fused-purple" />
          <span className="text-muted-foreground">{totalMembers.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="online-indicator" />
          <span className="text-green-400">{onlineCount}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-6', className)}>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-fused-purple/20 flex items-center justify-center">
          <Users className="w-5 h-5 text-fused-purple" />
        </div>
        <div>
          <p className="text-lg font-bold">{totalMembers.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Members</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center relative">
          <Wifi className="w-5 h-5 text-green-400" />
          <span className="absolute -top-1 -right-1 online-indicator" />
        </div>
        <div>
          <p className="text-lg font-bold text-green-400">{onlineCount}</p>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>
    </div>
  );
}
