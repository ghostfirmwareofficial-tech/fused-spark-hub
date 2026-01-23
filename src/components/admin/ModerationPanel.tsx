import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Ban, 
  Clock, 
  ShieldOff, 
  AlertTriangle,
  Undo2,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModeration, ModerationActionType } from '@/hooks/useModeration';
import BubbleCard from '@/components/ui/BubbleCard';
import { format } from 'date-fns';

interface ModerationPanelProps {
  userId: string;
  userIgn: string;
}

const actionIcons: Record<ModerationActionType, React.ReactNode> = {
  ban: <Ban className="w-4 h-4" />,
  timeout: <Clock className="w-4 h-4" />,
  restrict: <ShieldOff className="w-4 h-4" />,
  kick: <AlertTriangle className="w-4 h-4" />,
  warn: <AlertTriangle className="w-4 h-4" />,
};

const actionColors: Record<ModerationActionType, string> = {
  ban: 'bg-red-500/20 text-red-400 border-red-500/30',
  timeout: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  restrict: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  kick: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  warn: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

export default function ModerationPanel({ userId, userIgn }: ModerationPanelProps) {
  const { getUserModeration, applyModeration, revokeModeration, moderationActions } = useModeration();
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState<ModerationActionType>('warn');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');

  const userActions = getUserModeration(userId);

  const handleSubmit = () => {
    applyModeration.mutate({
      userId,
      actionType,
      reason: reason || undefined,
      durationMinutes: duration ? parseInt(duration) : undefined,
    });
    setIsOpen(false);
    setReason('');
    setDuration('');
  };

  return (
    <div className="space-y-4">
      {/* Active Moderation Status */}
      {userActions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Active Moderation:</p>
          {userActions.map((action) => (
            <div 
              key={action.id}
              className={`flex items-center justify-between p-3 rounded-lg border ${actionColors[action.action_type]}`}
            >
              <div className="flex items-center gap-2">
                {actionIcons[action.action_type]}
                <span className="font-medium capitalize">{action.action_type}</span>
                {action.expires_at && (
                  <span className="text-xs opacity-70">
                    (Expires: {format(new Date(action.expires_at), 'MMM d, h:mm a')})
                  </span>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => revokeModeration.mutate(action.id)}
                disabled={revokeModeration.isPending}
              >
                <Undo2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Apply New Action */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <ShieldOff className="w-4 h-4 mr-2" />
            Moderate User
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle>Moderate: {userIgn}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Action Type</label>
              <Select value={actionType} onValueChange={(v) => setActionType(v as ModerationActionType)}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="warn">⚠️ Warn</SelectItem>
                  <SelectItem value="timeout">⏱️ Timeout</SelectItem>
                  <SelectItem value="restrict">🛡️ Restrict</SelectItem>
                  <SelectItem value="kick">👢 Kick</SelectItem>
                  <SelectItem value="ban">🚫 Ban</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Reason (optional)</label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for moderation..."
                className="bg-white/5 border-white/10"
              />
            </div>

            {(actionType === 'timeout' || actionType === 'restrict') && (
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Duration (minutes)</label>
                <Input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="Leave empty for permanent"
                  className="bg-white/5 border-white/10"
                />
              </div>
            )}

            <Button
              onClick={handleSubmit}
              disabled={applyModeration.isPending}
              className="w-full bg-gradient-to-r from-destructive to-red-600 hover:opacity-90"
            >
              {applyModeration.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                actionIcons[actionType]
              )}
              <span className="ml-2 capitalize">Apply {actionType}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
