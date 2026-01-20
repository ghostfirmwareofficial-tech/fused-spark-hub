import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Zap, 
  Target, 
  ChevronRight,
  Flame,
  Crown,
  Star,
  Gamepad2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';

const features = [
  {
    icon: Trophy,
    title: 'Compete & Rise',
    description: 'Join our competitive roster and prove your skills in tournaments.',
  },
  {
    icon: Users,
    title: 'Community First',
    description: 'Connect with fellow gamers, share highlights, and grow together.',
  },
  {
    icon: Zap,
    title: 'Earn Rewards',
    description: 'Gain Fused Points through activity and unlock exclusive items.',
  },
  {
    icon: Target,
    title: 'Level Up',
    description: 'Progress through ranks and unlock new opportunities.',
  },
];

const teamTiers = [
  {
    name: 'Amateur',
    prRange: '0-49 PR',
    icon: Star,
    color: 'from-gray-400 to-gray-600',
    description: 'Starting point for aspiring competitors',
  },
  {
    name: 'Semi-Pro',
    prRange: '50-99 PR',
    icon: Flame,
    color: 'from-blue-400 to-cyan-600',
    description: 'Proven grinders ready for more',
  },
  {
    name: 'Pro',
    prRange: '100+ PR',
    icon: Crown,
    color: 'from-fused-purple to-fused-pink',
    description: 'Elite players representing Fused Up',
  },
];

const socialLinks = [
  { name: 'Discord', url: 'https://discord.gg/fusedupesports' },
  { name: 'YouTube', url: 'https://youtube.com/@fusedupesports' },
  { name: 'Twitter', url: 'https://x.com/fusedupesports' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@fused.up.esports' },
  { name: 'Instagram', url: 'https://www.instagram.com/fusedupesports' },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section with Video Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="video-bg"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <div className="video-overlay" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.img
              src="/images/fused-logo.png"
              alt="Fused Up"
              className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-8 animate-float"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">FUSED UP</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Fortnite Esports Organization
            </p>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Join the community. Compete at the highest level. Build your legacy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/apply">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-fused-purple to-fused-pink hover:opacity-90 text-foreground px-8 py-6 text-lg glow"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  Join the Team
                </Button>
              </Link>
              <Link to="/feed">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-fused-purple/50 text-foreground hover:bg-fused-purple/20 px-8 py-6 text-lg"
                >
                  Explore Community
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-fused-purple/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-fused-purple rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="gradient-text">Fused Up</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just a team. We're a community of passionate gamers pushing each other to greatness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full" glow>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fused-purple to-fused-pink flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Tiers Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Competitive <span className="gradient-text">Tiers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We have spots for players at every level. Find your place and level up.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <GlassCard className="p-8 text-center h-full relative overflow-hidden" glow>
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-5`} />
                  <div className="relative z-10">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6`}>
                      <tier.icon className="w-8 h-8 text-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className={`text-lg font-semibold mb-4 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                      {tier.prRange}
                    </p>
                    <p className="text-muted-foreground">{tier.description}</p>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 md:p-12" glow>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img 
                    src="/images/dubby-banner.png" 
                    alt="DUBBY" 
                    className="w-48 md:w-64 rounded-xl"
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-fused-pink font-semibold mb-2">Official Partner</p>
                  <h3 className="text-3xl font-bold mb-4">Fuel Your Grind</h3>
                  <p className="text-muted-foreground mb-6">
                    Get 10% off your DUBBY order and stay energized for those late-night sessions.
                  </p>
                  <a 
                    href="https://www.dubby.gg/discount/FusedUp?ref__=rnkmqges" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-gradient-to-r from-fused-purple to-fused-pink hover:opacity-90 text-foreground">
                      Use Code: FUSEDUP
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-fused-purple/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-3">
              <img 
                src="/images/fused-logo.png" 
                alt="Fused Up" 
                className="w-12 h-12"
              />
              <span className="text-2xl font-bold glow-text">FUSED UP</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-fused-purple transition-colors"
                >
                  {social.name}
                </a>
              ))}
            </div>
            
            <p className="text-muted-foreground text-sm">
              © 2024 Fused Up Esports. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
