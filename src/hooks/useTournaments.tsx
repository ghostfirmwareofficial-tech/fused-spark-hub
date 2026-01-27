import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';
import { useEffect } from 'react';

export type TournamentStatus = 'draft' | 'registration' | 'active' | 'completed' | 'cancelled';

export interface Tournament {
  id: string;
  name: string;
  description: string | null;
  entry_fee: number;
  base_prize_pool: number;
  current_prize_pool: number;
  status: TournamentStatus;
  starts_at: string | null;
  ends_at: string | null;
  max_participants: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TournamentEntry {
  id: string;
  tournament_id: string;
  user_id: string;
  epic_games_id: string;
  entry_paid: boolean;
  initial_wins: number;
  initial_kills: number;
  current_wins: number;
  current_kills: number;
  total_score: number;
  placement: number | null;
  prize_amount: number | null;
  payout_status: string;
  payout_notes: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    ign: string;
    avatar_url: string | null;
    rank: string;
  };
}

export interface PrizeTier {
  id: string;
  min_participants: number;
  max_participants: number | null;
  prize_pool: number;
}

export function useTournaments() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();

  // Fetch all tournaments
  const { data: tournaments = [], isLoading: tournamentsLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Tournament[];
    },
  });

  // Fetch prize tiers
  const { data: prizeTiers = [] } = useQuery({
    queryKey: ['prize-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prize_tiers')
        .select('*')
        .order('min_participants', { ascending: true });
      
      if (error) throw error;
      return data as PrizeTier[];
    },
  });

  // Get active tournament (registration or active)
  const activeTournament = tournaments.find(t => 
    t.status === 'registration' || t.status === 'active'
  );

  // Fetch entries for a specific tournament
  const useTournamentEntries = (tournamentId: string | undefined) => {
    return useQuery({
      queryKey: ['tournament-entries', tournamentId],
      queryFn: async () => {
        if (!tournamentId) return [];
        
        // First get entries
        const { data: entries, error: entriesError } = await supabase
          .from('tournament_entries')
          .select('*')
          .eq('tournament_id', tournamentId)
          .order('total_score', { ascending: false });
        
        if (entriesError) throw entriesError;
        if (!entries || entries.length === 0) return [];
        
        // Then get profiles for all users
        const userIds = entries.map(e => e.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, ign, avatar_url, rank')
          .in('user_id', userIds);
        
        if (profilesError) throw profilesError;
        
        // Merge profiles into entries
        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
        const entriesWithProfiles = entries.map(entry => ({
          ...entry,
          profiles: profileMap.get(entry.user_id) || null,
        }));
        
        return entriesWithProfiles as TournamentEntry[];
      },
      enabled: !!tournamentId,
    });
  };

  // Check if user is entered in a tournament
  const useUserEntry = (tournamentId: string | undefined) => {
    return useQuery({
      queryKey: ['user-tournament-entry', tournamentId, user?.id],
      queryFn: async () => {
        if (!tournamentId || !user) return null;
        
        const { data, error } = await supabase
          .from('tournament_entries')
          .select('*')
          .eq('tournament_id', tournamentId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        return data as TournamentEntry | null;
      },
      enabled: !!tournamentId && !!user,
    });
  };

  // Create tournament (admin only)
  const createTournament = useMutation({
    mutationFn: async (data: {
      name: string;
      description?: string;
      entry_fee?: number;
      base_prize_pool?: number;
      starts_at?: string;
      ends_at?: string;
      max_participants?: number;
    }) => {
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('tournaments')
        .insert({
          ...data,
          created_by: user.id,
          current_prize_pool: data.base_prize_pool || 25,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Tournament created!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update tournament (admin only)
  const updateTournament = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Tournament> & { id: string }) => {
      const { error } = await supabase
        .from('tournaments')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Tournament updated!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete tournament (admin only)
  const deleteTournament = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      toast.success('Tournament deleted');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Enter tournament
  const enterTournament = useMutation({
    mutationFn: async ({ tournamentId, epicGamesId }: { tournamentId: string; epicGamesId: string }) => {
      if (!user || !profile) throw new Error('Not authenticated');
      
      const tournament = tournaments.find(t => t.id === tournamentId);
      if (!tournament) throw new Error('Tournament not found');
      
      // Check if user has enough points
      if (profile.fused_points < tournament.entry_fee) {
        throw new Error('Not enough Fused Points');
      }
      
      // Deduct entry fee from user's points
      const { error: pointsError } = await supabase
        .from('profiles')
        .update({ fused_points: profile.fused_points - tournament.entry_fee })
        .eq('user_id', user.id);
      
      if (pointsError) throw pointsError;
      
      // Create entry
      const { error: entryError } = await supabase
        .from('tournament_entries')
        .insert({
          tournament_id: tournamentId,
          user_id: user.id,
          epic_games_id: epicGamesId,
          entry_paid: true,
        });
      
      if (entryError) {
        // Refund points if entry fails
        await supabase
          .from('profiles')
          .update({ fused_points: profile.fused_points })
          .eq('user_id', user.id);
        throw entryError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament-entries'] });
      queryClient.invalidateQueries({ queryKey: ['user-tournament-entry'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('You have entered the tournament!');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Update entry stats (admin only)
  const updateEntryStats = useMutation({
    mutationFn: async ({ 
      entryId, 
      current_wins, 
      current_kills 
    }: { 
      entryId: string; 
      current_wins: number; 
      current_kills: number; 
    }) => {
      const { error } = await supabase
        .from('tournament_entries')
        .update({ current_wins, current_kills })
        .eq('id', entryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament-entries'] });
    },
  });

  // Set placements and prizes (admin only)
  const finalizeTournament = useMutation({
    mutationFn: async (tournamentId: string) => {
      // Get entries sorted by score
      const { data: entries, error: fetchError } = await supabase
        .from('tournament_entries')
        .select('*')
        .eq('tournament_id', tournamentId)
        .eq('entry_paid', true)
        .order('total_score', { ascending: false });
      
      if (fetchError) throw fetchError;
      if (!entries || entries.length === 0) throw new Error('No entries found');
      
      // Get tournament for prize pool
      const tournament = tournaments.find(t => t.id === tournamentId);
      if (!tournament) throw new Error('Tournament not found');
      
      // Calculate prizes (60/25/15 split)
      const prizePool = Number(tournament.current_prize_pool);
      const prizes = [
        prizePool * 0.60, // 1st place
        prizePool * 0.25, // 2nd place
        prizePool * 0.15, // 3rd place
      ];
      
      // Update top 3 entries with placements and prizes
      for (let i = 0; i < Math.min(3, entries.length); i++) {
        const { error } = await supabase
          .from('tournament_entries')
          .update({
            placement: i + 1,
            prize_amount: prizes[i],
            payout_status: 'pending',
          })
          .eq('id', entries[i].id);
        
        if (error) throw error;
      }
      
      // Update remaining entries with their placements
      for (let i = 3; i < entries.length; i++) {
        const { error } = await supabase
          .from('tournament_entries')
          .update({ placement: i + 1 })
          .eq('id', entries[i].id);
        
        if (error) throw error;
      }
      
      // Mark tournament as completed
      const { error: statusError } = await supabase
        .from('tournaments')
        .update({ status: 'completed' })
        .eq('id', tournamentId);
      
      if (statusError) throw statusError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament-entries'] });
      toast.success('Tournament finalized! Winners have been determined.');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Mark payout as complete (admin only)
  const markPayout = useMutation({
    mutationFn: async ({ entryId, notes }: { entryId: string; notes?: string }) => {
      const { error } = await supabase
        .from('tournament_entries')
        .update({
          payout_status: 'completed',
          payout_notes: notes,
        })
        .eq('id', entryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournament-entries'] });
      toast.success('Payout marked as complete');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Setup realtime subscription for tournament entries
  const useRealtimeEntries = (tournamentId: string | undefined) => {
    useEffect(() => {
      if (!tournamentId) return;

      const channel = supabase
        .channel(`tournament-entries-${tournamentId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tournament_entries',
            filter: `tournament_id=eq.${tournamentId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['tournament-entries', tournamentId] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }, [tournamentId, queryClient]);
  };

  return {
    tournaments,
    tournamentsLoading,
    activeTournament,
    prizeTiers,
    useTournamentEntries,
    useUserEntry,
    useRealtimeEntries,
    createTournament,
    updateTournament,
    deleteTournament,
    enterTournament,
    updateEntryStats,
    finalizeTournament,
    markPayout,
  };
}
