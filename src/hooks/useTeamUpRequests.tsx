import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export const SUPPORTED_GAMES = [
  'Fortnite',
  'Call of Duty: Warzone',
  'Call of Duty: MW3',
  'Call of Duty: Black Ops 6',
  'Minecraft',
  'Rainbow Six Siege',
  'Apex Legends',
  'Valorant',
  'Rocket League',
  'FIFA 25',
  'GTA Online',
  'Other'
] as const;

export type TeamSize = 'duos' | 'trios' | 'quads';
export type GameMode = 'ranked' | 'unranked' | 'casual';

export interface TeamUpRequest {
  id: string;
  user_id: string;
  game: string;
  team_size: TeamSize;
  game_mode: GameMode;
  description: string | null;
  slots_available: number;
  is_active: boolean;
  created_at: string;
  profiles?: {
    ign: string;
    rank: string;
    avatar_url: string | null;
  };
}

interface CreateTeamUpInput {
  game: string;
  team_size: TeamSize;
  game_mode: GameMode;
  description?: string;
  slots_available?: number;
}

interface TeamUpFilters {
  game?: string;
  team_size?: TeamSize;
  game_mode?: GameMode;
}

export function useTeamUpRequests(filters?: TeamUpFilters) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['team-up-requests', filters],
    queryFn: async () => {
      let query = supabase
        .from('team_up_requests')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filters?.game) {
        query = query.eq('game', filters.game);
      }
      if (filters?.team_size) {
        query = query.eq('team_size', filters.team_size);
      }
      if (filters?.game_mode) {
        query = query.eq('game_mode', filters.game_mode);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch profiles
      const userIds = [...new Set(data.map(r => r.user_id))];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, ign, rank, avatar_url')
        .in('user_id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      return data.map(request => ({
        ...request,
        profiles: profilesMap.get(request.user_id) || {
          ign: 'Unknown',
          rank: 'Recruit',
          avatar_url: null,
        },
      })) as TeamUpRequest[];
    },
  });

  const createRequest = useMutation({
    mutationFn: async (input: CreateTeamUpInput) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('team_up_requests')
        .insert({
          user_id: user.id,
          game: input.game,
          team_size: input.team_size,
          game_mode: input.game_mode,
          description: input.description || null,
          slots_available: input.slots_available || 1,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-up-requests'] });
      toast.success('Team-up request created!');
    },
    onError: (error) => {
      toast.error('Failed to create request', { description: error.message });
    },
  });

  const deleteRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('team_up_requests')
        .delete()
        .eq('id', requestId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team-up-requests'] });
      toast.success('Request removed');
    },
  });

  return {
    requests,
    isLoading,
    createRequest,
    deleteRequest,
  };
}
