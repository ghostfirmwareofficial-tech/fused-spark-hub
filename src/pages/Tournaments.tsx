import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Users,
  DollarSign,
  Calendar,
  Timer,
  Loader2,
  Crown,
  Swords,
  Target,
  Zap,
  AlertCircle,
  Gamepad2,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';
import BubbleCard from '@/components/ui/BubbleCard';
import { useTournaments, TournamentEntry } from '@/hooks/useTournaments';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { cn } from '@/lib/utils';

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      const seconds = differenceInSeconds(new Date(targetDate), new Date());
      if (seconds <= 0) {
        setTimeLeft('Started!');
        return;
      }
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="font-mono">{timeLeft}</span>;
}

function LeaderboardEntry({ entry, rank }: { entry: TournamentEntry; rank: number }) {
  const isTop3 = rank <= 3;
  const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={cn(
        'flex items-center gap-4 p-3 rounded-lg transition-colors',
        isTop3 ? 'bg-gradient-to-r from-fused-purple/10 to-transparent' : 'hover:bg-white/5'
      )}
    >
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center font-bold',
        isTop3 ? 'bg-fused-purple/20' : 'bg-white/10'
      )}>
        {isTop3 ? (
          <Crown className={cn('w-5 h-5', medalColors[rank - 1])} />
        ) : (
          rank
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{entry.profiles?.ign || 'Unknown'}</p>
        <p className="text-xs text-muted-foreground">Epic: {entry.epic_games_id}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-fused-purple">{entry.total_score} pts</p>
        <p className="text-xs text-muted-foreground">
          +{entry.current_wins - entry.initial_wins}W / +{entry.current_kills - entry.initial_kills}K
        </p>
      </div>
    </motion.div>
  );
}

export default function Tournaments() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const {
    activeTournament,
    tournamentsLoading,
    useTournamentEntries,
    useUserEntry,
    useRealtimeEntries,
    enterTournament,
    prizeTiers,
  } = useTournaments();

  const { data: entries = [], isLoading: entriesLoading } = useTournamentEntries(activeTournament?.id);
  const { data: userEntry } = useUserEntry(activeTournament?.id);
  
  // Enable realtime updates
  useRealtimeEntries(activeTournament?.id);

  const paidEntries = entries.filter(e => e.entry_paid);
  const hasEpicConnected = !!profile?.epic_games_id;
  const hasEnoughPoints = (profile?.fused_points || 0) >= (activeTournament?.entry_fee || 250);
  const isEntered = !!userEntry;

  const handleEnter = async () => {
    if (!activeTournament || !profile?.epic_games_id) return;
    await enterTournament.mutateAsync({
      tournamentId: activeTournament.id,
      epicGamesId: profile.epic_games_id,
    });
  };

  // Calculate prize distribution
  const prizePool = Number(activeTournament?.current_prize_pool || 25);
  const prizes = [
    { place: '1st', amount: prizePool * 0.60, color: 'text-yellow-500' },
    { place: '2nd', amount: prizePool * 0.25, color: 'text-gray-400' },
    { place: '3rd', amount: prizePool * 0.15, color: 'text-amber-600' },
  ];

  if (tournamentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-fused-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            Weekly <span className="gradient-text">Tournament</span>
          </h1>
          <p className="text-muted-foreground">
            Compete in Fortnite Ranked for real cash prizes
          </p>
        </motion.div>

        {!activeTournament ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <GlassCard className="max-w-md mx-auto p-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h2 className="text-xl font-semibold mb-2">No Active Tournament</h2>
              <p className="text-muted-foreground">
                Check back soon! A new tournament will be announced shortly.
              </p>
            </GlassCard>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Tournament Info Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <GlassCard className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">{activeTournament.name}</h2>
                      <p className="text-muted-foreground">{activeTournament.description}</p>
                    </div>
                    <div className={cn(
                      'px-4 py-2 rounded-full font-semibold',
                      activeTournament.status === 'registration'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    )}>
                      {activeTournament.status === 'registration' ? 'Registration Open' : 'Tournament Active'}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/20">
                      <DollarSign className="w-6 h-6 text-green-400 mb-2" />
                      <p className="text-2xl font-bold">${prizePool.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">Prize Pool</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-fused-purple/20 to-fused-purple/5 border border-fused-purple/20">
                      <Zap className="w-6 h-6 text-fused-purple mb-2" />
                      <p className="text-2xl font-bold">{activeTournament.entry_fee}</p>
                      <p className="text-xs text-muted-foreground">Entry Fee (FP)</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/20">
                      <Users className="w-6 h-6 text-blue-400 mb-2" />
                      <p className="text-2xl font-bold">{paidEntries.length}</p>
                      <p className="text-xs text-muted-foreground">Participants</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/20">
                      <Timer className="w-6 h-6 text-orange-400 mb-2" />
                      {activeTournament.ends_at ? (
                        <>
                          <p className="text-lg font-bold">
                            <CountdownTimer targetDate={activeTournament.ends_at} />
                          </p>
                          <p className="text-xs text-muted-foreground">Time Remaining</p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-bold">7d</p>
                          <p className="text-xs text-muted-foreground">Duration</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Entry Section */}
                  {user ? (
                    isEntered ? (
                      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-4">
                        <CheckCircle className="w-8 h-8 text-green-400" />
                        <div>
                          <p className="font-semibold text-green-400">You're In!</p>
                          <p className="text-sm text-muted-foreground">
                            Play Fortnite Ranked and climb the leaderboard
                          </p>
                        </div>
                      </div>
                    ) : activeTournament.status !== 'registration' ? (
                      <div className="p-4 rounded-xl bg-muted/50 border border-white/10">
                        <p className="text-center text-muted-foreground">
                          Registration has closed for this tournament
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {!hasEpicConnected && (
                          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center gap-4">
                            <AlertCircle className="w-8 h-8 text-yellow-500" />
                            <div className="flex-1">
                              <p className="font-semibold text-yellow-500">Epic Games Not Connected</p>
                              <p className="text-sm text-muted-foreground">
                                Connect your Epic account to enter tournaments
                              </p>
                            </div>
                            <Button onClick={() => navigate('/profile')} variant="outline" size="sm">
                              <Gamepad2 className="w-4 h-4 mr-2" />
                              Connect
                            </Button>
                          </div>
                        )}
                        {hasEpicConnected && !hasEnoughPoints && (
                          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                            <div className="flex-1">
                              <p className="font-semibold text-red-400">Not Enough Points</p>
                              <p className="text-sm text-muted-foreground">
                                You need {activeTournament.entry_fee} FP to enter. You have {profile?.fused_points || 0} FP.
                              </p>
                            </div>
                            <Button onClick={() => navigate('/shop')} variant="outline" size="sm">
                              <Zap className="w-4 h-4 mr-2" />
                              Get Points
                            </Button>
                          </div>
                        )}
                        {hasEpicConnected && hasEnoughPoints && (
                          <Button
                            onClick={handleEnter}
                            disabled={enterTournament.isPending}
                            className="w-full h-14 text-lg bg-gradient-to-r from-fused-purple to-fused-blue hover:opacity-90"
                          >
                            {enterTournament.isPending ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <>
                                <Swords className="w-5 h-5 mr-2" />
                                Enter Tournament ({activeTournament.entry_fee} FP)
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="p-4 rounded-xl bg-muted/50 border border-white/10 text-center">
                      <p className="text-muted-foreground">Sign in to enter tournaments</p>
                    </div>
                  )}
                </GlassCard>
              </motion.div>

              {/* Leaderboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <BubbleCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-fused-purple" />
                    Live Leaderboard
                  </h3>

                  {entriesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-fused-purple" />
                    </div>
                  ) : paidEntries.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No entries yet. Be the first!</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {paidEntries
                        .sort((a, b) => b.total_score - a.total_score)
                        .map((entry, index) => (
                          <LeaderboardEntry key={entry.id} entry={entry} rank={index + 1} />
                        ))}
                    </div>
                  )}
                </BubbleCard>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prize Breakdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <GlassCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Prize Breakdown
                  </h3>
                  <div className="space-y-3">
                    {prizes.map((prize) => (
                      <div
                        key={prize.place}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <Crown className={cn('w-5 h-5', prize.color)} />
                          <span className="font-medium">{prize.place} Place</span>
                        </div>
                        <span className="font-bold text-green-400">
                          ${prize.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    * Prize split: 60% / 25% / 15%
                  </p>
                </GlassCard>
              </motion.div>

              {/* How It Works */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <BubbleCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-fused-purple/20 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Connect Epic Games</p>
                        <p className="text-sm text-muted-foreground">
                          Link your Epic account from your profile
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-fused-purple/20 flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Pay Entry Fee</p>
                        <p className="text-sm text-muted-foreground">
                          Use {activeTournament?.entry_fee || 250} Fused Points to enter
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-fused-purple/20 flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Play Ranked</p>
                        <p className="text-sm text-muted-foreground">
                          Your wins + kills over the week determine your score
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-fused-purple/20 flex items-center justify-center text-sm font-bold">
                        4
                      </div>
                      <div>
                        <p className="font-medium">Win Prizes</p>
                        <p className="text-sm text-muted-foreground">
                          Top 3 players win real cash prizes!
                        </p>
                      </div>
                    </div>
                  </div>
                </BubbleCard>
              </motion.div>

              {/* Scoring */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <BubbleCard className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Scoring System</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 rounded bg-white/5">
                      <span>Victory Royale</span>
                      <span className="font-bold text-fused-purple">+100 pts</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-white/5">
                      <span>Per Elimination</span>
                      <span className="font-bold text-fused-purple">+10 pts</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Only Fortnite Ranked matches count. Stats are tracked from when you enter.
                  </p>
                </BubbleCard>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
