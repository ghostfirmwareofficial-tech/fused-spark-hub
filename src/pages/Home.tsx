import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Trophy, Users, Zap, Target, ChevronRight, Flame, Crown, Star, Gamepad2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';

const features = [{
  icon: Trophy,
  title: 'Compete & Rise',
  description: 'Join our competitive roster and prove your skills in tournaments.'
}, {
  icon: Users,
  title: 'Community First',
  description: 'Connect with fellow gamers, share highlights, and grow together.'
}, {
  icon: Zap,
  title: 'Earn Rewards',
  description: 'Gain Fused Points through activity and unlock exclusive items.'
}, {
  icon: Target,
  title: 'Level Up',
  description: 'Progress through ranks and unlock new opportunities.'
}];

const teamTiers = [{
  name: 'Amateur',
  prRange: '0-49 PR',
  icon: Star,
  color: 'from-gray-400 to-gray-600',
  description: 'Starting point for aspiring competitors'
}, {
  name: 'Semi-Pro',
  prRange: '50-99 PR',
  icon: Flame,
  color: 'from-blue-400 to-cyan-600',
  description: 'Proven grinders ready for more'
}, {
  name: 'Pro',
  prRange: '100+ PR',
  icon: Crown,
  color: 'from-fused-purple to-fused-pink',
  description: 'Elite players representing Fused Up'
}];

const socialLinks = [{
  name: 'Discord',
  url: 'https://discord.gg/fusedupesports'
}, {
  name: 'YouTube',
  url: 'https://youtube.com/@fusedupesports'
}, {
  name: 'Twitter',
  url: 'https://x.com/fusedupesports'
}, {
  name: 'TikTok',
  url: 'https://www.tiktok.com/@fused.up.esports'
}, {
  name: 'Instagram',
  url: 'https://www.instagram.com/fusedupesports'
}];

export default function Home() {
  return <div className="relative -mt-24">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
        {/* Animated accent lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-fused-purple/50 to-transparent"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
          <motion.div
            className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-fused-pink/30 to-transparent"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.8
          }} className="max-w-4xl mx-auto">
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-float"
            >
              <Sparkles className="w-4 h-4 text-fused-pink" />
              <span className="text-sm font-medium text-gradient-animated">Fortnite Esports Organization</span>
              <Sparkles className="w-4 h-4 text-fused-purple" />
            </motion.div>
            
            <motion.h1 
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-gradient-animated drop-shadow-[0_0_30px_hsl(263,70%,50%,0.5)]">FUSED UP</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Join the community. Compete at the highest level. <br />
              <span className="text-fused-purple font-semibold">Build your legacy.</span>
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link to="/apply">
                <Button size="lg" className="px-8 py-6 text-lg bg-gradient-to-r from-fused-purple to-fused-pink hover:opacity-90 hover-glow group">
                  <Gamepad2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Join the Team
                </Button>
              </Link>
              <Link to="/feed">
                <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-fused-purple/30 hover:bg-fused-purple/10 hover:border-fused-purple/50 transition-all">
                  Explore Community
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-fused-purple/30 flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-1.5 rounded-full bg-fused-purple" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why <span className="gradient-text">Fused Up</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              More than just a team. We're a community of passionate gamers pushing each other to greatness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => <motion.div key={feature.title} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
                <GlassCard className="p-6 h-full hover-glow group" glow>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fused-purple to-fused-pink flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-fused-purple/20">
                    <feature.icon className="w-7 h-7 text-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-fused-purple transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Team Tiers Section */}
      <section className="py-24 px-4 relative">
        {/* Section background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-fused-purple/5 to-transparent pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Competitive <span className="text-gradient-animated">Tiers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We have spots for players at every level. Find your place and level up.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamTiers.map((tier, index) => <motion.div key={tier.name} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.15
            }} whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                <GlassCard className="p-8 text-center h-full relative overflow-hidden hover-glow group" glow>
                  <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <motion.div 
                      className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6 shadow-lg`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <tier.icon className="w-10 h-10 text-foreground" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className={`text-lg font-semibold mb-4 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                      {tier.prRange}
                    </p>
                    <p className="text-muted-foreground">{tier.description}</p>
                  </div>
                </GlassCard>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Team Tiers Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Competitive <span className="gradient-text">Tiers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We have spots for players at every level. Find your place and level up.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamTiers.map((tier, index) => <motion.div key={tier.name} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.15
          }}>
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
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Sponsor Section */}
      <section className="py-24 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <GlassCard className="p-8 md:p-12" glow>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img src="/images/dubby-banner.png" alt="DUBBY" className="w-48 md:w-64 rounded-xl" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-fused-pink font-semibold mb-2">Official Partner</p>
                  <h3 className="text-3xl font-bold mb-4">Fuel Your Grind</h3>
                  <p className="text-muted-foreground mb-6">
                    Get 10% off your DUBBY order and stay energized for those late-night sessions.
                  </p>
                  <a href="https://www.dubby.gg/discount/FusedUp?ref__=rnkmqges" target="_blank" rel="noopener noreferrer">
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
              <img src="/images/fused-logo.png" alt="Fused Up" className="w-12 h-12" />
              <span className="text-2xl font-bold glow-text">FUSED UP</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {socialLinks.map(social => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-fused-purple transition-colors">
                  {social.name}
                </a>)}
            </div>
            
            <p className="text-muted-foreground text-sm">
              © 2024 Fused Up Esports. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
}