import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Users,
  DollarSign,
  Timer,
  Loader2,
  Crown,
  Swords,
  Target,
  Zap,
  AlertCircle,
  Gamepad2,
  CheckCircle,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTournaments, TournamentEntry } from '@/hooks/useTournaments';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';
import { differenceInSeconds } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

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

  return <span className="font-display font-bold">{timeLeft}</span>;
}

function LeaderboardEntry({ 
  entry, 
  rank, 
  isCurrentUser,
  onRefresh,
  isRefreshing,
}: { 
  entry: TournamentEntry; 
  rank: number; 
  isCurrentUser: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  const isTop3 = rank <= 3;
  const getRankClass = () => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return '';
  };

  const winsGained = (entry.current_wins || 0) - (entry.initial_wins || 0);
  const killsGained = (entry.current_kills || 0) - (entry.initial_kills || 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl transition-all',
        isTop3 ? 'stat-card' : 'bg-white/5 hover:bg-white/10',
        isCurrentUser && 'ring-2 ring-primary/50'
      )}
    >
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center font-display font-black text-lg',
        isTop3 ? 'bg-gradient-to-br from-fused-purple to-fused-blue' : 'bg-white/10'
      )}>
        {isTop3 ? (
          <Crown className={cn('w-5 h-5', rank === 1 ? 'text-yellow-400' : rank === 2 ? 'text-gray-300' : 'text-amber-600')} />
        ) : (
          <span className="text-muted-foreground">{rank}</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn('font-display font-bold text-lg truncate', isTop3 && getRankClass())}>
            {entry.profiles?.ign || 'Unknown'}
          </p>
          {isCurrentUser && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-primary/20 text-primary uppercase">You</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-medium">Epic: {entry.epic_games_id}</p>
      </div>

      <div className="text-right">
        <p className={cn('font-display font-black text-2xl', isTop3 ? 'gradient-text' : 'text-foreground')}>
          {entry.total_score || 0}
        </p>
        <p className="text-xs text-muted-foreground font-semibold">
          +{winsGained}W / +{killsGained}K
        </p>
      </div>

      {isCurrentUser && onRefresh && (
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          size="sm"
          variant="outline"
          className="rounded-lg font-display font-bold uppercase text-xs"
        >
          {isRefreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      )}
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
    refreshMyStats,
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

  const handleRefreshStats = async () => {
    if (!userEntry || !profile?.epic_games_id) return;
    await refreshMyStats.mutateAsync({
      entryId: userEntry.id,
      epicGamesId: profile.epic_games_id,
    });
  };

  // Calculate prize distribution
  const prizePool = Number(activeTournament?.current_prize_pool || 25);
  const prizes = [
    { place: '1ST', amount: prizePool * 0.60, color: 'text-yellow-400' },
    { place: '2ND', amount: prizePool * 0.25, color: 'text-gray-300' },
    { place: '3RD', amount: prizePool * 0.15, color: 'text-amber-600' },
  ];

  if (tournamentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-fused-purple" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-[400px] h-[400px] rounded-full bg-fused-purple/10 blur-[100px]" />
        <div className="absolute bottom-20 left-20 w-[300px] h-[300px] rounded-full bg-fused-blue/10 blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="tournament-badge inline-flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4" />
            Weekly Competition
          </span>
          <h1 className="esports-title text-5xl md:text-7xl mb-3">
            CASH <span className="gradient-text">TOURNAMENT</span>
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Compete in Fortnite Ranked for real cash prizes
          </p>
        </motion.div>

        {!activeTournament ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="stat-card max-w-md mx-auto p-10">
              <Trophy className="w-20 h-20 mx-auto mb-6 text-muted-foreground opacity-30" />
              <h2 className="font-display font-bold text-2xl mb-3 uppercase">No Active Tournament</h2>
              <p className="text-muted-foreground">
                Check back soon! A new tournament will be announced shortly.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Tournament Info Card */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="stat-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <h2 className="font-display font-black text-2xl uppercase mb-2">{activeTournament.name}</h2>
                      <p className="text-muted-foreground">{activeTournament.description}</p>
                    </div>
                    <div className={cn(
                      'tournament-badge',
                      activeTournament.status === 'registration'
                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                        : 'bg-green-500/20 border-green-500/50 text-green-400'
                    )}>
                      {activeTournament.status === 'registration' ? 'REGISTRATION OPEN' : 'TOURNAMENT ACTIVE'}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30">
                      <DollarSign className="w-7 h-7 text-green-400 mb-2" />
                      <p className="font-display font-black text-3xl">${prizePool.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Prize Pool</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-fused-purple/20 to-fused-purple/5 border border-fused-purple/30">
                      <Zap className="w-7 h-7 text-fused-purple mb-2" />
                      <p className="font-display font-black text-3xl">{activeTournament.entry_fee}</p>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Entry (FP)</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/5 border border-blue-500/30">
                      <Users className="w-7 h-7 text-blue-400 mb-2" />
                      <p className="font-display font-black text-3xl">{paidEntries.length}</p>
                      <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Players</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-500/5 border border-orange-500/30">
                      <Timer className="w-7 h-7 text-orange-400 mb-2" />
                      {activeTournament.ends_at ? (
                        <>
                          <p className="font-display font-bold text-xl">
                            <CountdownTimer targetDate={activeTournament.ends_at} />
                          </p>
                          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Remaining</p>
                        </>
                      ) : (
                        <>
                          <p className="font-display font-black text-3xl">7d</p>
                          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Duration</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Entry Section */}
                  {user ? (
                    isEntered ? (
                      <div className="p-5 rounded-xl bg-green-500/10 border-2 border-green-500/30 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-7 h-7 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-display font-bold text-green-400 uppercase">You're In!</p>
                          <p className="text-sm text-muted-foreground">
                            Play Fortnite Ranked and click "Update Stats" to refresh your score
                          </p>
                        </div>
                        <Button
                          onClick={handleRefreshStats}
                          disabled={refreshMyStats.isPending}
                          className="rounded-lg font-display font-bold uppercase bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 text-green-400"
                        >
                          {refreshMyStats.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <TrendingUp className="w-4 h-4 mr-2" />
                          )}
                          Update Stats
                        </Button>
                      </div>
                    ) : activeTournament.status !== 'registration' ? (
                      <div className="p-5 rounded-xl bg-muted/50 border border-white/10">
                        <p className="text-center text-muted-foreground font-medium">
                          Registration has closed for this tournament
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {!hasEpicConnected && (
                          <div className="p-4 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/30 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                              <AlertCircle className="w-7 h-7 text-yellow-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-display font-bold text-yellow-500 uppercase">Epic Games Not Connected</p>
                              <p className="text-sm text-muted-foreground">
                                Connect your Epic username to enter tournaments
                              </p>
                            </div>
                            <Button onClick={() => navigate('/profile')} variant="outline" className="rounded-lg font-display font-bold uppercase">
                              <Gamepad2 className="w-4 h-4 mr-2" />
                              Connect
                            </Button>
                          </div>
                        )}
                        {hasEpicConnected && !hasEnoughPoints && (
                          <div className="p-4 rounded-xl bg-red-500/10 border-2 border-red-500/30 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                              <AlertCircle className="w-7 h-7 text-red-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-display font-bold text-red-400 uppercase">Not Enough Points</p>
                              <p className="text-sm text-muted-foreground">
                                You need {activeTournament.entry_fee} FP. You have {profile?.fused_points || 0} FP.
                              </p>
                            </div>
                            <Button onClick={() => navigate('/shop')} variant="outline" className="rounded-lg font-display font-bold uppercase">
                              <Zap className="w-4 h-4 mr-2" />
                              Get Points
                            </Button>
                          </div>
                        )}
                        {hasEpicConnected && hasEnoughPoints && (
                          <Button
                            onClick={handleEnter}
                            disabled={enterTournament.isPending}
                            className="w-full h-16 text-lg font-display font-black uppercase tracking-wide bg-gradient-to-r from-fused-purple to-fused-blue hover:opacity-90 rounded-xl border-0 shadow-xl shadow-fused-purple/25"
                          >
                            {enterTournament.isPending ? (
                              <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                              <>
                                <Swords className="w-6 h-6 mr-3" />
                                Enter Tournament ({activeTournament.entry_fee} FP)
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="p-5 rounded-xl bg-muted/50 border border-white/10 text-center">
                      <p className="text-muted-foreground font-medium">Sign in to enter tournaments</p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Leaderboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="stat-card p-6">
                  <h3 className="font-display font-bold text-xl mb-5 flex items-center gap-2 uppercase">
                    <Target className="w-6 h-6 text-fused-purple" />
                    Live Leaderboard
                  </h3>

                  {entriesLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="w-8 h-8 animate-spin text-fused-purple" />
                    </div>
                  ) : paidEntries.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                      <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="font-display font-bold text-lg uppercase">No entries yet</p>
                      <p className="text-sm">Be the first to enter!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paidEntries
                        .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
                        .map((entry, index) => (
                          <LeaderboardEntry
                            key={entry.id}
                            entry={entry}
                            rank={index + 1}
                            isCurrentUser={entry.user_id === user?.id}
                            onRefresh={entry.user_id === user?.id ? handleRefreshStats : undefined}
                            isRefreshing={refreshMyStats.isPending}
                          />
                        ))}
                    </div>
                  )}
                </div>
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
                <div className="stat-card p-6">
                  <h3 className="font-display font-bold text-lg mb-5 flex items-center gap-2 uppercase">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Prize Breakdown
                  </h3>
                  <div className="space-y-3">
                    {prizes.map((prize) => (
                      <div
                        key={prize.place}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <Crown className={cn('w-6 h-6', prize.color)} />
                          <span className="font-display font-bold text-lg">{prize.place}</span>
                        </div>
                        <span className="font-display font-black text-xl text-green-400">
                          ${prize.amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 font-medium">
                    * Prize split: 60% / 25% / 15%
                  </p>
                </div>
              </motion.div>

              {/* How It Works */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="stat-card p-6">
                  <h3 className="font-display font-bold text-lg mb-5 uppercase">How It Works</h3>
                  <div className="space-y-5">
                    {[
                      { step: 1, title: 'Connect Epic Games', desc: 'Link your Epic username from your profile' },
                      { step: 2, title: 'Pay Entry Fee', desc: `Use ${activeTournament?.entry_fee || 250} Fused Points to enter` },
                      { step: 3, title: 'Play Ranked', desc: 'Your wins + kills during the week count' },
                      { step: 4, title: 'Update Stats', desc: 'Click "Update Stats" to refresh your score' },
                    ].map((item) => (
                      <div key={item.step} className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-fused-purple to-fused-blue flex items-center justify-center font-display font-black text-lg flex-shrink-0">
                          {item.step}
                        </div>
                        <div>
                          <p className="font-display font-bold uppercase">{item.title}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Scoring */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="stat-card p-6">
                  <h3 className="font-display font-bold text-lg mb-5 uppercase">Scoring System</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 rounded-lg bg-white/5">
                      <span className="font-medium">Victory Royale</span>
                      <span className="font-display font-black text-fused-purple">+100 pts</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-lg bg-white/5">
                      <span className="font-medium">Per Elimination</span>
                      <span className="font-display font-black text-fused-purple">+10 pts</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 font-medium">
                    Only Fortnite Ranked matches count. Stats are tracked from when you enter.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
