import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'admin' | 'moderator' | 'user';

export function useUserRole() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: roles, isLoading } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data?.map(r => r.role as AppRole) || [];
    },
    enabled: !!user,
  });

  const isAdmin = roles?.includes('admin') || false;
  const isModerator = roles?.includes('moderator') || false;

  const assignRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
    },
  });

  return {
    roles,
    isLoading,
    isAdmin,
    isModerator,
    assignRole,
  };
}
