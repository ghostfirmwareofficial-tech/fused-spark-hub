import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export type ApplicationStatus = 'pending' | 'reviewing' | 'accepted' | 'rejected';

export interface Application {
  id: string;
  user_id: string;
  ign: string;
  discord_username: string | null;
  age: number | null;
  region: string | null;
  experience: string | null;
  pr_score: number | null;
  why_join: string;
  availability: string | null;
  status: ApplicationStatus;
  admin_notes: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

interface SubmitApplicationData {
  ign: string;
  discord_username?: string;
  age?: number;
  region?: string;
  experience?: string;
  pr_score?: number;
  why_join: string;
  availability?: string;
}

export function useApplications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's own applications
  const { data: myApplications = [], isLoading: isLoadingMy } = useQuery({
    queryKey: ['my-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Application[];
    },
    enabled: !!user,
  });

  // Fetch all applications (for admins/mods)
  const { data: allApplications = [], isLoading: isLoadingAll, refetch: refetchAll } = useQuery({
    queryKey: ['all-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Application[];
    },
    enabled: !!user,
  });

  // Submit a new application
  const submitApplication = useMutation({
    mutationFn: async (applicationData: SubmitApplicationData) => {
      if (!user) throw new Error('You must be logged in to submit an application');
      
      const { data, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          ...applicationData,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });

  // Update application status (for admins/mods)
  const updateApplicationStatus = useMutation({
    mutationFn: async ({ 
      applicationId, 
      status, 
      adminNotes 
    }: { 
      applicationId: string; 
      status: ApplicationStatus; 
      adminNotes?: string;
    }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ 
          status, 
          admin_notes: adminNotes,
          reviewed_by: user?.id 
        })
        .eq('id', applicationId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      toast.success('Application status updated');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update application');
    },
  });

  return {
    myApplications,
    allApplications,
    isLoadingMy,
    isLoadingAll,
    submitApplication,
    updateApplicationStatus,
    refetchAll,
  };
}
