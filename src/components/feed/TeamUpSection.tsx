import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Gamepad2, 
  Filter, 
  Plus, 
  X, 
  Trophy,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import GlassCard from '@/components/ui/GlassCard';
import { useTeamUpRequests, SUPPORTED_GAMES, TeamSize, GameMode } from '@/hooks/useTeamUpRequests';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

export default function TeamUpSection() {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  
  // Filters
  const [filterGame, setFilterGame] = useState<string>('');
  const [filterTeamSize, setFilterTeamSize] = useState<TeamSize | ''>('');
  const [filterGameMode, setFilterGameMode] = useState<GameMode | ''>('');
  
  // Create form
  const [newGame, setNewGame] = useState<string>('');
  const [newTeamSize, setNewTeamSize] = useState<TeamSize>('duos');
  const [newGameMode, setNewGameMode] = useState<GameMode>('casual');
  const [newDescription, setNewDescription] = useState('');
  const [newSlots, setNewSlots] = useState(1);

  const { requests, isLoading, createRequest, deleteRequest } = useTeamUpRequests({
    game: filterGame || undefined,
    team_size: filterTeamSize || undefined,
    game_mode: filterGameMode || undefined,
  });

  const handleCreate = async () => {
    if (!newGame) return;
    await createRequest.mutateAsync({
      game: newGame,
      team_size: newTeamSize,
      game_mode: newGameMode,
      description: newDescription || undefined,
      slots_available: newSlots,
    });
    setShowCreate(false);
    setNewGame('');
    setNewDescription('');
    setNewSlots(1);
  };

  const teamSizeLabels: Record<TeamSize, string> = {
    duos: 'Duos',
    trios: 'Trios',
    quads: 'Quads',
  };

  const gameModeLabels: Record<GameMode, string> = {
    ranked: 'Ranked',
    unranked: 'Unranked',
    casual: 'Casual',
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-fused-purple" />
          <h2 className="font-semibold">Team Up</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-fused-purple/20' : ''}
          >
            <Filter className="w-4 h-4 mr-1" />
            Filter
          </Button>
          {user && (
            <Button 
              size="sm" 
              onClick={() => setShowCreate(!showCreate)}
              className="bg-gradient-to-r from-fused-purple to-fused-blue"
            >
              <Plus className="w-4 h-4 mr-1" />
              Find Team
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="p-4">
              <div className="grid grid-cols-3 gap-3">
                <Select value={filterGame} onValueChange={setFilterGame}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="All Games" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                    <SelectItem value="">All Games</SelectItem>
                    {SUPPORTED_GAMES.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterTeamSize} onValueChange={(v) => setFilterTeamSize(v as TeamSize | '')}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Team Size" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                    <SelectItem value="">Any Size</SelectItem>
                    <SelectItem value="duos">Duos</SelectItem>
                    <SelectItem value="trios">Trios</SelectItem>
                    <SelectItem value="quads">Quads</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterGameMode} onValueChange={(v) => setFilterGameMode(v as GameMode | '')}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Game Mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                    <SelectItem value="">Any Mode</SelectItem>
                    <SelectItem value="ranked">Ranked</SelectItem>
                    <SelectItem value="unranked">Unranked</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <GlassCard className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Create Team-Up Request</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select value={newGame} onValueChange={setNewGame}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select Game" />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                    {SUPPORTED_GAMES.map(game => (
                      <SelectItem key={game} value={game}>{game}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={newTeamSize} onValueChange={(v) => setNewTeamSize(v as TeamSize)}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                    <SelectItem value="duos">Duos</SelectItem>
                    <SelectItem value="trios">Trios</SelectItem>
                    <SelectItem value="quads">Quads</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Select value={newGameMode} onValueChange={(v) => setNewGameMode(v as GameMode)}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-md border-white/10">
                    <SelectItem value="ranked">Ranked</SelectItem>
                    <SelectItem value="unranked">Unranked</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  min={1}
                  max={3}
                  value={newSlots}
                  onChange={(e) => setNewSlots(parseInt(e.target.value) || 1)}
                  placeholder="Slots needed"
                  className="bg-white/5 border-white/10"
                />
              </div>

              <Textarea
                placeholder="Add a description (optional)..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="bg-white/5 border-white/10 resize-none"
                rows={2}
              />

              <Button 
                onClick={handleCreate} 
                disabled={!newGame || createRequest.isPending}
                className="w-full bg-gradient-to-r from-fused-purple to-fused-blue"
              >
                {createRequest.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Request'}
              </Button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requests List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-fused-purple" />
        </div>
      ) : requests.length === 0 ? (
        <GlassCard className="p-6 text-center text-muted-foreground">
          <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No team-up requests yet</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <GlassCard className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fused-purple/30 to-fused-blue/30 flex items-center justify-center flex-shrink-0">
                    {request.profiles?.avatar_url ? (
                      <img src={request.profiles.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
                    ) : (
                      <Gamepad2 className="w-5 h-5 text-fused-purple" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{request.profiles?.ign}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(request.created_at), 'h:mm a')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-fused-purple/20 text-fused-purple text-xs">
                        {request.game}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-fused-blue/20 text-fused-blue text-xs">
                        {teamSizeLabels[request.team_size]}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        request.game_mode === 'ranked' 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : 'bg-white/10 text-muted-foreground'
                      }`}>
                        {request.game_mode === 'ranked' && <Trophy className="w-3 h-3 inline mr-1" />}
                        {gameModeLabels[request.game_mode]}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {request.slots_available} slot{request.slots_available > 1 ? 's' : ''} open
                      </span>
                    </div>
                    {request.description && (
                      <p className="text-sm text-muted-foreground mt-2">{request.description}</p>
                    )}
                  </div>
                  {user?.id === request.user_id && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteRequest.mutate(request.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
