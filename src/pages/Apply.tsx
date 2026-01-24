import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy,
  Palette,
  Video,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
  Send,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import GlassCard from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useApplications, ApplicationStatus } from '@/hooks/useApplications';

type TeamType = 'Competitive' | 'Creative' | 'Content' | 'Community' | null;

interface TeamOption {
  id: TeamType;
  name: string;
  icon: typeof Trophy;
  description: string;
  color: string;
}

const teamOptions: TeamOption[] = [
  {
    id: 'Competitive',
    name: 'Competitive',
    icon: Trophy,
    description: 'Join our competitive roster and compete in tournaments',
    color: 'from-blue-400 to-cyan-600',
  },
  {
    id: 'Creative',
    name: 'Creative',
    icon: Palette,
    description: 'Create stunning edits, thumbnails, and graphics',
    color: 'from-fused-purple to-fused-pink',
  },
  {
    id: 'Content',
    name: 'Content',
    icon: Video,
    description: 'Stream, create videos, and grow our brand',
    color: 'from-pink-400 to-rose-600',
  },
  {
    id: 'Community',
    name: 'Community',
    icon: Users,
    description: 'Help moderate and grow our community',
    color: 'from-green-400 to-emerald-600',
  },
];

const statusConfig: Record<ApplicationStatus, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'Pending Review', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
  reviewing: { label: 'Under Review', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Eye },
  accepted: { label: 'Accepted', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
  rejected: { label: 'Not Accepted', color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
};

export default function Apply() {
  const { user } = useAuth();
  const { myApplications, isLoadingMy, submitApplication } = useApplications();
  const [selectedTeam, setSelectedTeam] = useState<TeamType>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ign: '',
    discord: '',
    age: '',
    region: '',
    prScore: '',
    experience: '',
    availability: '',
    whyJoin: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTeamSelect = (team: TeamType) => {
    setSelectedTeam(team);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      return;
    }

    await submitApplication.mutateAsync({
      ign: formData.ign,
      discord_username: formData.discord || undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      region: formData.region || undefined,
      pr_score: formData.prScore ? parseInt(formData.prScore) : undefined,
      experience: `${selectedTeam} Team - ${formData.experience || 'No additional experience provided'}`,
      availability: formData.availability || undefined,
      why_join: formData.whyJoin,
    });
    
    setStep(3);
  };

  // Show existing applications if user has any
  if (myApplications.length > 0 && step === 1) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold mb-4">
              Your <span className="gradient-text">Applications</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Track the status of your applications to Fused Up.
            </p>
          </motion.div>

          <div className="space-y-4 mb-8">
            {isLoadingMy ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              myApplications.map((app) => {
                const status = statusConfig[app.status];
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <GlassCard className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/30 to-fused-blue/30 flex items-center justify-center">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{app.ign}</h3>
                            <p className="text-sm text-muted-foreground">
                              Applied {new Date(app.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className={cn("border", status.color)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      
                      {app.status === 'accepted' && (
                        <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                          <p className="text-green-400 text-sm">
                            🎉 Congratulations! Your application has been accepted. Join our Discord for next steps!
                          </p>
                          <a 
                            href="https://discord.gg/fusedupesports" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 inline-block"
                          >
                            <Button size="sm" className="bg-[#5865F2] hover:bg-[#4752C4]">
                              Join Discord
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                          </a>
                        </div>
                      )}

                      {app.status === 'rejected' && (
                        <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                          <p className="text-red-400 text-sm">
                            Unfortunately, your application wasn't accepted this time. You can apply again in the future!
                          </p>
                        </div>
                      )}
                    </GlassCard>
                  </motion.div>
                );
              })
            )}
          </div>

          <div className="text-center">
            <Button
              onClick={() => setStep(1.5)}
              className="bg-gradient-to-r from-primary to-fused-blue"
            >
              Submit New Application
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Reset to team selection if user wants to apply again
  if (step === 1.5) {
    setStep(1);
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">
            Join <span className="gradient-text">Fused Up</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {!user ? 'Sign in to submit your application and join our growing community.' : 'Ready to take your gaming career to the next level? Apply now to join our growing community.'}
          </p>
        </motion.div>

        {!user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <GlassCard className="p-8 max-w-md mx-auto">
              <p className="text-muted-foreground mb-4">You need to be signed in to apply.</p>
              <p className="text-sm text-muted-foreground">
                Create an account or sign in to submit your application.
              </p>
            </GlassCard>
          </motion.div>
        )}

        {user && (
          <>
            {/* Progress Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center justify-center gap-4 mb-12"
            >
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all",
                    step >= s 
                      ? "bg-gradient-to-r from-fused-purple to-fused-pink text-foreground"
                      : "bg-white/10 text-muted-foreground"
                  )}>
                    {step > s ? <Check className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={cn(
                      "w-16 h-1 rounded-full",
                      step > s ? "bg-gradient-to-r from-fused-purple to-fused-pink" : "bg-white/10"
                    )} />
                  )}
                </div>
              ))}
            </motion.div>

            <AnimatePresence mode="wait">
              {/* Step 1: Team Selection */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h2 className="text-2xl font-semibold text-center mb-8">
                    What team are you applying for?
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {teamOptions.map((team) => (
                      <GlassCard
                        key={team.id}
                        className={cn(
                          "p-6 cursor-pointer border-2 transition-all",
                          selectedTeam === team.id && "border-fused-purple"
                        )}
                        onClick={() => handleTeamSelect(team.id)}
                        glow={selectedTeam === team.id}
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${team.color} flex items-center justify-center mb-4`}>
                          <team.icon className="w-6 h-6 text-foreground" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                        <p className="text-muted-foreground text-sm">{team.description}</p>
                      </GlassCard>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Application Form */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <GlassCard className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="flex items-center gap-3 pb-6 border-b border-white/10">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setStep(1)}
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                        <span className="text-lg font-semibold">
                          {selectedTeam} Application
                        </span>
                      </div>

                      {/* Basic Info */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ign">In-Game Name *</Label>
                          <Input
                            id="ign"
                            name="ign"
                            value={formData.ign}
                            onChange={handleInputChange}
                            placeholder="Your IGN"
                            required
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="discord">Discord Username *</Label>
                          <Input
                            id="discord"
                            name="discord"
                            value={formData.discord}
                            onChange={handleInputChange}
                            placeholder="username"
                            required
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            name="age"
                            type="number"
                            value={formData.age}
                            onChange={handleInputChange}
                            placeholder="Your age"
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="region">Region</Label>
                          <Input
                            id="region"
                            name="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            placeholder="NA East, EU West, etc."
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                      </div>

                      {/* Competitive-specific fields */}
                      {selectedTeam === 'Competitive' && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="prScore">Power Ranking (PR) *</Label>
                            <Input
                              id="prScore"
                              name="prScore"
                              type="number"
                              value={formData.prScore}
                              onChange={handleInputChange}
                              placeholder="Your current PR"
                              required
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="availability">Availability</Label>
                            <Input
                              id="availability"
                              name="availability"
                              value={formData.availability}
                              onChange={handleInputChange}
                              placeholder="Hours per week"
                              className="bg-white/5 border-white/10"
                            />
                          </div>
                        </div>
                      )}

                      {/* Experience */}
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience & Achievements</Label>
                        <Textarea
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          placeholder="Tell us about your gaming experience, achievements, past teams, etc."
                          className="bg-white/5 border-white/10 min-h-[100px]"
                        />
                      </div>

                      {/* Why Join */}
                      <div className="space-y-2">
                        <Label htmlFor="whyJoin">Why do you want to join Fused Up? *</Label>
                        <Textarea
                          id="whyJoin"
                          name="whyJoin"
                          value={formData.whyJoin}
                          onChange={handleInputChange}
                          placeholder="Tell us about yourself and why you'd be a great fit..."
                          required
                          className="bg-white/5 border-white/10 min-h-[150px]"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={submitApplication.isPending}
                        className="w-full bg-gradient-to-r from-fused-purple to-fused-pink hover:opacity-90 text-foreground py-6"
                      >
                        {submitApplication.isPending ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 mr-2" />
                        )}
                        Submit Application
                      </Button>
                    </form>
                  </GlassCard>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <GlassCard className="p-12" glow>
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center mb-6">
                      <Check className="w-10 h-10 text-foreground" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Application Submitted!</h2>
                    <p className="text-muted-foreground max-w-md mx-auto mb-8">
                      Thanks for applying to Fused Up! We'll review your application and get back to you via Discord within 48 hours.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a 
                        href="https://discord.gg/fusedupesports" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-foreground">
                          Join Our Discord
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </a>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
