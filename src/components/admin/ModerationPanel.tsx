import { useState } from 'react';
import { 
  Ban, 
  Clock, 
  ShieldOff, 
  AlertTriangle,
  Undo2,
  Loader2,
  Crown,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
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
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';

type AppRole = 'admin' | 'moderator' | 'user';

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
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [actionType, setActionType] = useState<ModerationActionType>('warn');
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('moderator');

  const userActions = getUserModeration(userId);

  // Fetch user's current roles
  const { data: userRoles = [] } = useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data?.map(r => r.role as AppRole) || [];
    },
  });

  // Assign role mutation
  const assignRole = useMutation({
    mutationFn: async (role: AppRole) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', userId] });
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
      toast.success('Role assigned successfully');
    },
    onError: (error) => {
      toast.error('Failed to assign role: ' + error.message);
    },
  });

  // Remove role mutation
  const removeRole = useMutation({
    mutationFn: async (role: AppRole) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', userId] });
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
      toast.success('Role removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove role: ' + error.message);
    },
  });

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

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'moderator':
        return <ShieldCheck className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'moderator':
        return 'bg-primary/20 text-primary border-primary/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-4">
      {/* User Roles Section */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground font-medium">User Roles:</p>
        <div className="flex flex-wrap gap-2">
          {userRoles.length === 0 ? (
            <Badge variant="outline" className="text-xs bg-muted/50 text-muted-foreground">
              Regular User
            </Badge>
          ) : (
            userRoles.map((role) => (
              <Badge
                key={role}
                variant="outline"
                className={`text-xs flex items-center gap-1 ${getRoleColor(role)}`}
              >
                {getRoleIcon(role)}
                {role.charAt(0).toUpperCase() + role.slice(1)}
                <button
                  onClick={() => removeRole.mutate(role)}
                  className="ml-1 hover:text-destructive transition-colors"
                  disabled={removeRole.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
        
        {/* Add Role */}
        <div className="flex items-center gap-2 mt-2">
          <Select
            value={selectedRole}
            onValueChange={(value) => setSelectedRole(value as AppRole)}
          >
            <SelectTrigger className="w-32 bg-background/50 border-border/50 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <span className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-destructive" /> Admin
                </span>
              </SelectItem>
              <SelectItem value="moderator">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-primary" /> Moderator
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={() => assignRole.mutate(selectedRole)}
            disabled={assignRole.isPending || userRoles.includes(selectedRole)}
            className="h-8"
          >
            {assignRole.isPending ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              'Add Role'
            )}
          </Button>
        </div>
      </div>

      <div className="border-t border-border/30 pt-4" />

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
