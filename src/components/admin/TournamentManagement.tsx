import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Plus,
  Edit2,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  Users,
  DollarSign,
  Calendar,
  Loader2,
  RefreshCw,
  Award,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import BubbleCard from '@/components/ui/BubbleCard';
import { useTournaments, Tournament, TournamentStatus } from '@/hooks/useTournaments';
import { format } from 'date-fns';

const statusColors: Record<TournamentStatus, string> = {
  draft: 'bg-muted text-muted-foreground',
  registration: 'bg-blue-500/20 text-blue-400',
  active: 'bg-green-500/20 text-green-400',
  completed: 'bg-fused-purple/20 text-fused-purple',
  cancelled: 'bg-destructive/20 text-destructive',
};

const statusIcons: Record<TournamentStatus, React.ReactNode> = {
  draft: <Edit2 className="w-4 h-4" />,
  registration: <Users className="w-4 h-4" />,
  active: <Play className="w-4 h-4" />,
  completed: <CheckCircle className="w-4 h-4" />,
  cancelled: <Pause className="w-4 h-4" />,
};

export default function TournamentManagement() {
  const {
    tournaments,
    tournamentsLoading,
    prizeTiers,
    useTournamentEntries,
    createTournament,
    updateTournament,
    deleteTournament,
    finalizeTournament,
    updateEntryStats,
    markPayout,
  } = useTournaments();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    entry_fee: 250,
    base_prize_pool: 25,
    starts_at: '',
    ends_at: '',
    max_participants: 100,
  });

  const { data: entries = [], isLoading: entriesLoading } = useTournamentEntries(selectedTournament?.id);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      entry_fee: 250,
      base_prize_pool: 25,
      starts_at: '',
      ends_at: '',
      max_participants: 100,
    });
  };

  const handleCreate = async () => {
    await createTournament.mutateAsync({
      name: formData.name,
      description: formData.description || undefined,
      entry_fee: formData.entry_fee,
      base_prize_pool: formData.base_prize_pool,
      starts_at: formData.starts_at || undefined,
      ends_at: formData.ends_at || undefined,
      max_participants: formData.max_participants,
    });
    setCreateOpen(false);
    resetForm();
  };

  const handleStatusChange = async (tournament: Tournament, newStatus: TournamentStatus) => {
    await updateTournament.mutateAsync({
      id: tournament.id,
      status: newStatus,
    });
  };

  const handleFinalize = async (tournament: Tournament) => {
    if (confirm('This will calculate final placements and determine winners. Continue?')) {
      await finalizeTournament.mutateAsync(tournament.id);
    }
  };

  const handleDelete = async (tournament: Tournament) => {
    if (confirm(`Delete "${tournament.name}"? This cannot be undone.`)) {
      await deleteTournament.mutateAsync(tournament.id);
    }
  };

  const paidEntries = entries.filter(e => e.entry_paid);

  return (
    <BubbleCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Tournament Management
        </h2>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              New Tournament
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Tournament</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tournament Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  placeholder="Weekly Ranked Challenge"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(f => ({ ...f, description: e.target.value }))}
                  placeholder="Compete for real cash prizes..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Entry Fee (FP)</Label>
                  <Input
                    type="number"
                    value={formData.entry_fee}
                    onChange={(e) => setFormData(f => ({ ...f, entry_fee: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>Base Prize ($)</Label>
                  <Input
                    type="number"
                    value={formData.base_prize_pool}
                    onChange={(e) => setFormData(f => ({ ...f, base_prize_pool: Number(e.target.value) }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Starts At</Label>
                  <Input
                    type="datetime-local"
                    value={formData.starts_at}
                    onChange={(e) => setFormData(f => ({ ...f, starts_at: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Ends At</Label>
                  <Input
                    type="datetime-local"
                    value={formData.ends_at}
                    onChange={(e) => setFormData(f => ({ ...f, ends_at: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>Max Participants</Label>
                <Input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(f => ({ ...f, max_participants: Number(e.target.value) }))}
                />
              </div>
              <Button
                onClick={handleCreate}
                disabled={!formData.name || createTournament.isPending}
                className="w-full"
              >
                {createTournament.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Create Tournament'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Prize Tiers Info */}
      <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
        <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          Prize Tiers (auto-scales with participants)
        </h3>
        <div className="flex flex-wrap gap-2">
          {prizeTiers.map((tier) => (
            <span key={tier.id} className="text-xs px-2 py-1 rounded bg-white/10">
              {tier.min_participants}-{tier.max_participants || '∞'} players: ${tier.prize_pool}
            </span>
          ))}
        </div>
      </div>

      {tournamentsLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-fused-purple" />
        </div>
      ) : tournaments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No tournaments yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tournaments.map((tournament) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                selectedTournament?.id === tournament.id
                  ? 'bg-fused-purple/10 border-fused-purple/30'
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
              onClick={() => setSelectedTournament(tournament)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {tournament.name}
                    <span className={`px-2 py-0.5 text-xs rounded-full flex items-center gap-1 ${statusColors[tournament.status]}`}>
                      {statusIcons[tournament.status]}
                      {tournament.status}
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{tournament.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-400" />
                      ${Number(tournament.current_prize_pool).toFixed(2)} prize
                    </span>
                    <span className="flex items-center gap-1 text-fused-purple">
                      {tournament.entry_fee} FP entry
                    </span>
                    {tournament.starts_at && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(tournament.starts_at), 'MMM d, h:mm a')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={tournament.status}
                    onValueChange={(value) => handleStatusChange(tournament, value as TournamentStatus)}
                  >
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="registration">Registration</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  {tournament.status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFinalize(tournament);
                      }}
                      className="gap-1"
                    >
                      <Award className="w-4 h-4" />
                      Finalize
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(tournament);
                    }}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Selected Tournament Entries */}
      <AnimatePresence>
        {selectedTournament && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-white/10"
          >
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              {selectedTournament.name} - Entries ({paidEntries.length})
            </h3>

            {entriesLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : paidEntries.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No entries yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="pb-2 font-medium">#</th>
                      <th className="pb-2 font-medium">Player</th>
                      <th className="pb-2 font-medium">Epic ID</th>
                      <th className="pb-2 font-medium">Wins</th>
                      <th className="pb-2 font-medium">Kills</th>
                      <th className="pb-2 font-medium">Score</th>
                      {selectedTournament.status === 'completed' && (
                        <>
                          <th className="pb-2 font-medium">Prize</th>
                          <th className="pb-2 font-medium">Payout</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {paidEntries.map((entry, index) => (
                      <tr key={entry.id} className="hover:bg-white/5">
                        <td className="py-3">
                          {entry.placement || index + 1}
                          {entry.placement === 1 && <Crown className="w-4 h-4 inline ml-1 text-yellow-500" />}
                          {entry.placement === 2 && <Crown className="w-4 h-4 inline ml-1 text-gray-400" />}
                          {entry.placement === 3 && <Crown className="w-4 h-4 inline ml-1 text-amber-600" />}
                        </td>
                        <td className="py-3 font-medium">{entry.profiles?.ign || 'Unknown'}</td>
                        <td className="py-3 text-muted-foreground">{entry.epic_games_id}</td>
                        <td className="py-3">{entry.current_wins - entry.initial_wins}</td>
                        <td className="py-3">{entry.current_kills - entry.initial_kills}</td>
                        <td className="py-3 font-semibold text-fused-purple">{entry.total_score}</td>
                        {selectedTournament.status === 'completed' && (
                          <>
                            <td className="py-3 text-green-400">
                              {entry.prize_amount ? `$${Number(entry.prize_amount).toFixed(2)}` : '-'}
                            </td>
                            <td className="py-3">
                              {entry.prize_amount ? (
                                entry.payout_status === 'completed' ? (
                                  <span className="text-green-400 flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Paid
                                  </span>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => markPayout.mutate({ entryId: entry.id })}
                                    disabled={markPayout.isPending}
                                    className="h-7 text-xs"
                                  >
                                    Mark Paid
                                  </Button>
                                )
                              ) : '-'}
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </BubbleCard>
  );
}
