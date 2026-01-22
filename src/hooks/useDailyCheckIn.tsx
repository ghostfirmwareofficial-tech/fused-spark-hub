import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export function useDailyCheckIn() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = profile?.last_check_in === today;

  const checkIn = useMutation({
    mutationFn: async () => {
      if (!user || !profile) throw new Error('Not authenticated');
      if (hasCheckedInToday) throw new Error('Already checked in today');

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      // Calculate streak
      const wasYesterday = profile.last_check_in === yesterdayStr;
      const newStreak = wasYesterday ? (profile.current_streak || 0) + 1 : 1;
      const longestStreak = Math.max(newStreak, profile.longest_streak || 0);

      // Streak bonus: base 10 + (streak * 2), max 50 bonus
      const basePoints = 10;
      const streakBonus = Math.min(newStreak * 2, 50);
      const totalPoints = basePoints + streakBonus;

      const { error } = await supabase
        .from('profiles')
        .update({
          last_check_in: today,
          current_streak: newStreak,
          longest_streak: longestStreak,
          fused_points: (profile.fused_points || 0) + totalPoints,
          total_points_earned: (profile.total_points_earned || 0) + totalPoints,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      return { points: totalPoints, streak: newStreak };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(`+${data.points} FP!`, {
        description: `🔥 ${data.streak} day streak! Keep it up!`,
      });
    },
    onError: (error) => {
      toast.error('Check-in failed', {
        description: error.message,
      });
    },
  });

  return {
    hasCheckedInToday,
    currentStreak: profile?.current_streak || 0,
    longestStreak: profile?.longest_streak || 0,
    checkIn,
  };
}
