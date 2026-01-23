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
          <motion.div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-fused-purple/50 to-transparent" initial={{
          opacity: 0,
          scaleX: 0
        }} animate={{
          opacity: 1,
          scaleX: 1
        }} transition={{
          duration: 1.5,
          delay: 0.5
        }} />
          <motion.div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-fused-pink/30 to-transparent" initial={{
          opacity: 0,
          scaleX: 0
        }} animate={{
          opacity: 1,
          scaleX: 1
        }} transition={{
          duration: 1.5,
          delay: 0.8
        }} />
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
            <motion.div initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.3,
            duration: 0.6
          }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-float">
              <Sparkles className="w-4 h-4 text-fused-pink" />
              <span className="text-sm font-medium text-gradient-animated">Fortnite Esports Organization</span>
              <Sparkles className="w-4 h-4 text-fused-purple" />
            </motion.div>
            
            <motion.h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 tracking-tight" initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} transition={{
            duration: 0.8,
            delay: 0.2
          }}>
              <span className="text-gradient-animated drop-shadow-[0_0_30px_hsl(263,70%,50%,0.5)]">jaxon is a gay boy</span>
            </motion.h1>
            
            <motion.p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto mb-12 leading-relaxed" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            delay: 0.5,
            duration: 0.8
          }}>
              Join the community. Compete at the highest level. <br />
              <span className="text-fused-purple font-semibold">Build your legacy.</span>
            </motion.p>
            
            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: 0.7,
            duration: 0.6
          }}>
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
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.2
      }}>
          <motion.div animate={{
          y: [0, 10, 0]
        }} transition={{
          duration: 2,
          repeat: Infinity
        }} className="w-6 h-10 rounded-full border-2 border-fused-purple/30 flex justify-center pt-2">
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
          }}>
                {/* Creative card with angled accent */}
                <div className="group relative h-full">
                  {/* Angled background accent */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-fused-purple to-fused-pink rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
                  
                  <div className="relative h-full p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-white/10 overflow-hidden">
                    {/* Diagonal stripe accent */}
                    
                    
                    {/* Icon with hexagonal feel */}
                    <div className="relative w-14 h-14 mb-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-fused-purple to-fused-pink rounded-xl rotate-3" />
                      <div className="absolute inset-0.5 bg-card rounded-xl rotate-3 flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-fused-purple" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-fused-purple transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    
                    {/* Bottom accent line */}
                    <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-fused-purple/50 via-fused-pink/50 to-transparent" />
                  </div>
                </div>
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
                {/* Tier card with unique shape */}
                <div className="group relative">
                  {/* Outer glow on hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-br ${tier.color} rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`} />
                  
                  <div className="relative p-8 rounded-3xl bg-card/60 backdrop-blur-md border border-white/10 text-center overflow-hidden">
                    {/* Top decorative bar */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r ${tier.color} rounded-b-full`} />
                    
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br ${tier.color} rounded-full blur-3xl`} />
                    </div>
                    
                    {/* Icon container with ring */}
                    <div className="relative mx-auto w-24 h-24 mb-6">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${tier.color} opacity-20 group-hover:opacity-40 transition-opacity`} />
                      <div className={`absolute inset-2 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                        <tier.icon className="w-10 h-10 text-foreground drop-shadow-lg" />
                      </div>
                      {/* Orbiting dot */}
                      <div className="absolute inset-0 animate-[spin_8s_linear_infinite]">
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gradient-to-r ${tier.color}`} />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className={`text-lg font-semibold mb-4 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                      {tier.prRange}
                    </p>
                    <p className="text-muted-foreground">{tier.description}</p>
                    
                    {/* Bottom corners */}
                    
                    <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-3xl opacity-30`} />
                  </div>
                </div>
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
            {/* Sponsor card with frame design */}
            <div className="relative">
              {/* Decorative frame corners */}
              <div className="absolute -top-2 -left-2 w-12 h-12 border-t-2 border-l-2 border-fused-purple rounded-tl-xl" />
              <div className="absolute -top-2 -right-2 w-12 h-12 border-t-2 border-r-2 border-fused-pink rounded-tr-xl" />
              <div className="absolute -bottom-2 -left-2 w-12 h-12 border-b-2 border-l-2 border-fused-pink rounded-bl-xl" />
              <div className="absolute -bottom-2 -right-2 w-12 h-12 border-b-2 border-r-2 border-fused-purple rounded-br-xl" />
              
              <div className="p-8 md:p-12 rounded-2xl bg-card/60 backdrop-blur-md border border-white/10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0 relative">
                    {/* Image with glow */}
                    <div className="absolute inset-0 bg-fused-purple/20 blur-xl rounded-xl" />
                    <img src="/images/dubby-banner.png" alt="DUBBY" className="relative w-48 md:w-64 rounded-xl" />
                  </div>
                  <div className="text-center md:text-left">
                    <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-fused-pink bg-fused-pink/10 rounded-full mb-3">
                      Official Partner
                    </span>
                    <h3 className="text-3xl font-bold mb-4">Fuel Your Grind</h3>
                    <p className="text-muted-foreground mb-6">
                      Get 10% off your DUBBY order and stay energized for those late-night sessions.
                    </p>
                    <a href="https://www.dubby.gg/discount/FusedUp?ref__=rnkmqges" target="_blank" rel="noopener noreferrer">
                      <Button className="bg-gradient-to-r from-fused-purple to-fused-pink hover:opacity-90 text-foreground group">
                        Use Code: FUSEDUP
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 relative">
        {/* Footer top border with gradient */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fused-purple/50 to-transparent" />
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-3">
              <img src="/images/fused-logo.png" alt="Fused Up" className="w-12 h-12" />
              <span className="text-2xl font-bold gradient-text">FUSED UP</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {socialLinks.map(social => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-fused-purple transition-colors relative group">
                  {social.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-fused-purple group-hover:w-full transition-all duration-300" />
                </a>)}
            </div>
            
            <p className="text-muted-foreground text-sm">
              © 2025 Fused Up Esports. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>;
}