import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Search, Shield, ShieldCheck, User, Trash2, Crown } from 'lucide-react';
import type { AppRole } from '@/hooks/useUserRole';

interface UserWithRoles {
  user_id: string;
  ign: string;
  avatar_url: string | null;
  roles: AppRole[];
}

export default function RoleManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>('moderator');
  const queryClient = useQueryClient();

  // Fetch all users with their roles
  const { data: users, isLoading } = useQuery({
    queryKey: ['all-users-roles'],
    queryFn: async () => {
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, ign, avatar_url');
      
      if (profilesError) throw profilesError;

      // Get all roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');
      
      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        ...profile,
        roles: (roles || [])
          .filter(r => r.user_id === profile.user_id)
          .map(r => r.role as AppRole)
      }));

      return usersWithRoles;
    },
  });

  const assignRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Role assigned successfully');
      setSelectedUserId(null);
    },
    onError: (error) => {
      toast.error('Failed to assign role: ' + error.message);
    },
  });

  const removeRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-users-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Role removed successfully');
    },
    onError: (error) => {
      toast.error('Failed to remove role: ' + error.message);
    },
  });

  const filteredUsers = users?.filter(user =>
    user.ign.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getRoleIcon = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-3 w-3" />;
      case 'moderator':
        return <ShieldCheck className="h-3 w-3" />;
      default:
        return <User className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: AppRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderator':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Role Management</h2>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by IGN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/50"
        />
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No users found</div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.user_id}
              className="glass-card p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.ign} className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.ign}</p>
                  <div className="flex gap-1 mt-1">
                    {user.roles.length === 0 ? (
                      <Badge variant="outline" className="text-xs bg-gray-500/20 text-gray-400">
                        User
                      </Badge>
                    ) : (
                      user.roles.map((role) => (
                        <Badge
                          key={role}
                          variant="outline"
                          className={`text-xs flex items-center gap-1 ${getRoleColor(role)}`}
                        >
                          {getRoleIcon(role)}
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                          <button
                            onClick={() => removeRole.mutate({ userId: user.user_id, role })}
                            className="ml-1 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Add Role */}
              {selectedUserId === user.user_id ? (
                <div className="flex items-center gap-2">
                  <Select
                    value={selectedRole}
                    onValueChange={(value) => setSelectedRole(value as AppRole)}
                  >
                    <SelectTrigger className="w-32 bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={() => assignRole.mutate({ userId: user.user_id, role: selectedRole })}
                    disabled={assignRole.isPending}
                  >
                    Assign
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedUserId(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedUserId(user.user_id)}
                >
                  Add Role
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
