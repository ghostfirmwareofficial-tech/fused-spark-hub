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
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import GlassCard from '@/components/ui/GlassCard';
import VideoBackground from '@/components/ui/VideoBackground';
import { cn } from '@/lib/utils';

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

export default function Apply() {
  const [selectedTeam, setSelectedTeam] = useState<TeamType>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ign: '',
    email: '',
    discord: '',
    prScore: '',
    trackerLink: '',
    clipsLinks: '',
    socialYoutube: '',
    socialTwitter: '',
    socialTiktok: '',
    socialTwitch: '',
    followerCount: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    setStep(3);
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      <VideoBackground opacity={0.2} />
      <div className="max-w-3xl mx-auto relative z-10">
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
            Ready to take your gaming career to the next level? Apply now to join our growing community.
          </p>
        </motion.div>

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
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your@email.com"
                        required
                        className="bg-white/5 border-white/10"
                      />
                    </div>
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

                  {/* Competitive-specific fields */}
                  {selectedTeam === 'Competitive' && (
                    <>
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
                          <Label htmlFor="trackerLink">Fortnite Tracker Link *</Label>
                          <Input
                            id="trackerLink"
                            name="trackerLink"
                            value={formData.trackerLink}
                            onChange={handleInputChange}
                            placeholder="https://fortnitetracker.com/..."
                            required
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clipsLinks">Clips/VOD Links</Label>
                        <Textarea
                          id="clipsLinks"
                          name="clipsLinks"
                          value={formData.clipsLinks}
                          onChange={handleInputChange}
                          placeholder="Paste your best gameplay clips (one per line)"
                          className="bg-white/5 border-white/10 min-h-[100px]"
                        />
                      </div>
                    </>
                  )}

                  {/* Content-specific fields */}
                  {selectedTeam === 'Content' && (
                    <>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="socialYoutube">YouTube Channel</Label>
                          <Input
                            id="socialYoutube"
                            name="socialYoutube"
                            value={formData.socialYoutube}
                            onChange={handleInputChange}
                            placeholder="https://youtube.com/..."
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="socialTwitch">Twitch Channel</Label>
                          <Input
                            id="socialTwitch"
                            name="socialTwitch"
                            value={formData.socialTwitch}
                            onChange={handleInputChange}
                            placeholder="https://twitch.tv/..."
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="socialTwitter">Twitter/X</Label>
                          <Input
                            id="socialTwitter"
                            name="socialTwitter"
                            value={formData.socialTwitter}
                            onChange={handleInputChange}
                            placeholder="https://x.com/..."
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="socialTiktok">TikTok</Label>
                          <Input
                            id="socialTiktok"
                            name="socialTiktok"
                            value={formData.socialTiktok}
                            onChange={handleInputChange}
                            placeholder="https://tiktok.com/..."
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="followerCount">Total Follower Count</Label>
                        <Input
                          id="followerCount"
                          name="followerCount"
                          type="number"
                          value={formData.followerCount}
                          onChange={handleInputChange}
                          placeholder="Combined followers across platforms"
                          className="bg-white/5 border-white/10"
                        />
                      </div>
                    </>
                  )}

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
                    className="w-full bg-gradient-to-r from-fused-purple to-fused-pink hover:opacity-90 text-foreground py-6"
                  >
                    <Send className="w-5 h-5 mr-2" />
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
      </div>
    </div>
  );
}
