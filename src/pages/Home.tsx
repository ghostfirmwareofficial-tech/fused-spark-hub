import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Zap, Star, Flame, Crown, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

const teamMembers = [
  { name: 'Alex', role: 'Pro Player', avatar: '/placeholder.svg' },
  { name: 'Jordan', role: 'Coach', avatar: '/placeholder.svg' },
  { name: 'Sam', role: 'Analyst', avatar: '/placeholder.svg' },
];

const teamTiers = [
  {
    name: 'Amateur',
    prRange: '0-49 PR',
    icon: Star,
    color: 'from-gray-400 to-gray-600',
    description: 'Starting point for aspiring competitors'
  },
  {
    name: 'Semi-Pro',
    prRange: '50-99 PR',
    icon: Flame,
    color: 'from-primary to-fused-mint',
    description: 'Proven grinders ready for more'
  },
  {
    name: 'Pro',
    prRange: '100+ PR',
    icon: Crown,
    color: 'from-yellow-400 to-amber-500',
    description: 'Elite players representing Fused Up'
  }
];

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-100px)] relative px-4 lg:px-8 py-8">
        <div className="glass-container min-h-[calc(100vh-150px)] p-8 lg:p-12">
          {/* Decorative floating elements */}
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-primary/5 blur-3xl animate-float" />
          <div className="absolute bottom-40 left-40 w-24 h-24 rounded-full bg-fused-mint/5 blur-2xl animate-float" style={{ animationDelay: '2s' }} />
          
          <div className="grid lg:grid-cols-[1fr,380px] gap-8 h-full">
            {/* Main Content */}
            <div className="flex flex-col justify-center">
              {/* Hero Text */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-8">
                  <span className="text-foreground">WE</span><br />
                  <span className="text-foreground">BUILD</span><br />
                  <span className="gradient-text">CHAMPIONS.</span>
                </h1>
                
                <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
                  From competitive Fortnite to digital gaming strategies, we craft tailored solutions to drive your esports success.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link to="/apply">
                    <Button 
                      size="lg" 
                      className="rounded-full px-8 py-6 bg-primary text-primary-foreground hover:bg-primary/90 group"
                    >
                      Join the Team
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/feed">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="rounded-full px-8 py-6 border-white/20 hover:bg-white/5"
                    >
                      Explore Community
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-auto pt-12"
              >
                <motion.div 
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex flex-col items-center gap-2 text-muted-foreground"
                >
                  <span className="text-xs uppercase tracking-wider">Scroll</span>
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </motion.div>
            </div>

            {/* Right Sidebar Info */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col gap-6"
            >
              {/* What We Do Card */}
              <div className="info-card flex-1">
                <h3 className="text-lg font-semibold mb-3">WHAT WE DO?</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We specialize in creating dynamic esports experiences tailored to your team's needs. From training programs to tournament organization.
                </p>
              </div>

              {/* Team Avatars */}
              <div className="info-card">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-2">
                    {teamMembers.map((member, index) => (
                      <div 
                        key={member.name}
                        className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden"
                        style={{ zIndex: teamMembers.length - index }}
                      >
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">+50 Members</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
                  >
                    View Team
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
                  >
                    Join Discord
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="info-card text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-xs text-muted-foreground">Active Members</div>
                </div>
                <div className="info-card text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-xs text-muted-foreground">Tournament Wins</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 lg:px-8">
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

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Trophy, title: 'Compete & Rise', description: 'Join our competitive roster and prove your skills in tournaments.' },
              { icon: Users, title: 'Community First', description: 'Connect with fellow gamers, share highlights, and grow together.' },
              { icon: Zap, title: 'Earn Rewards', description: 'Gain Fused Points through activity and unlock exclusive items.' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass-card glass-card-hover p-8 h-full">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Tiers Section */}
      <section className="py-24 px-4 lg:px-8">
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
                <div className="glass-card glass-card-hover p-8 text-center h-full">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${tier.color} mx-auto mb-6 flex items-center justify-center`}>
                    <tier.icon className="w-10 h-10 text-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className={`text-lg font-semibold mb-4 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    {tier.prRange}
                  </p>
                  <p className="text-muted-foreground">{tier.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor Section */}
      <section className="py-24 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-primary/10 blur-xl rounded-xl" />
                  <img 
                    src="/images/dubby-banner.png" 
                    alt="DUBBY" 
                    className="relative w-48 md:w-64 rounded-xl"
                  />
                </div>
                <div className="text-center md:text-left">
                  <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 rounded-full mb-3">
                    Official Partner
                  </span>
                  <h3 className="text-3xl font-bold mb-4">Fuel Your Grind</h3>
                  <p className="text-muted-foreground mb-6">
                    Get 10% off your DUBBY order and stay energized for those late-night sessions.
                  </p>
                  <a 
                    href="https://www.dubby.gg/discount/FusedUp?ref__=rnkmqges" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 group">
                      Use Code: FUSEDUP
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 lg:px-8 relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-3">
              <img src="/images/fused-logo.png" alt="Fused Up" className="w-12 h-12" />
              <span className="text-2xl font-bold gradient-text">FUSED UP</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {['Discord', 'YouTube', 'Twitter', 'TikTok', 'Instagram'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {social}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>
            
            <p className="text-muted-foreground text-sm">
              © 2025 Fused Up Esports. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}