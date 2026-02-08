import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Zap, Star, Flame, Crown, ChevronDown, Gamepad2, Target, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Profile images
import profile1 from '@/assets/profile-1.png';
import profile2 from '@/assets/profile-2.jpg';
import profile3 from '@/assets/profile-3.png';

// Partner logos
import redragonLogo from '@/assets/redragon-logo.png';
import epomakerLogo from '@/assets/epomaker-logo.png';
const teamMembers = [{
  name: 'FusedUp',
  role: 'Team',
  avatar: profile1
}, {
  name: 'Member',
  role: 'Player',
  avatar: profile2
}, {
  name: 'Elite',
  role: 'Pro',
  avatar: profile3
}];
const partners = [{
  name: 'Redragon',
  logo: redragonLogo,
  url: 'https://redragonshop.com/?aff=6399',
  code: 'FusedUp',
  description: 'Premium gaming peripherals - keyboards, mice & headsets'
}, {
  name: 'Epomaker',
  logo: epomakerLogo,
  url: 'https://epomaker.com/?sca_ref=10502130.4JjKHc6UKU',
  code: 'FusedUp',
  description: 'Custom mechanical keyboards & accessories'
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
  color: 'from-primary to-fused-blue',
  description: 'Proven grinders ready for more'
}, {
  name: 'Pro',
  prRange: '100+ PR',
  icon: Crown,
  color: 'from-yellow-400 to-amber-500',
  description: 'Elite players representing Fused Up'
}];
export default function Home() {
  return <div className="relative">
      {/* Hero Section - Aggressive Esports Design */}
      <section className="min-h-[calc(100vh-100px)] relative px-4 lg:px-8 py-4 flex items-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-fused-purple/20 blur-[120px] animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-fused-blue/15 blur-[100px] animate-pulse" style={{
          animationDelay: '1s'
        }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-fused-violet/10 blur-[150px]" />
        </div>

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(hsl(var(--fused-purple) / 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--fused-purple) / 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

        <div className="glass-container w-full p-8 lg:p-12 relative scanlines">
          <div className="grid lg:grid-cols-[1fr,400px] gap-8">
            {/* Main Content */}
            <div className="flex flex-col justify-center py-8">
              {/* Badge */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5
            }} className="mb-6">
                <span className="tournament-badge inline-flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4" />
                  Fortnite Esports Organization
                </span>
              </motion.div>

              {/* Hero Text */}
              <motion.div initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.8
            }} className="max-w-3xl">
                <h1 className="esports-title text-6xl md:text-8xl lg:text-9xl leading-[0.85] mb-8">
                  <span className="text-foreground block">FUSED
                </span>
                  <span className="gradient-text glow-text glitch-text block" data-text="CHAMPIONS">ESPORTS
                </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mb-10 leading-relaxed font-medium">
                  Elite Fortnite team. Weekly tournaments. Real cash prizes. 
                  <span className="text-primary"> Join the grind.</span>
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link to="/tournaments">
                    <Button size="lg" className="rounded-lg px-8 py-7 text-lg font-display font-bold uppercase tracking-wide bg-gradient-to-r from-fused-purple to-fused-blue hover:opacity-90 group shadow-xl shadow-fused-purple/25 border-0">
                      <Trophy className="w-5 h-5 mr-2" />
                      Enter Tournament
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link to="/apply">
                    <Button size="lg" variant="outline" className="rounded-lg px-8 py-7 text-lg font-display font-bold uppercase tracking-wide border-2 border-primary/50 hover:bg-primary/10 hover:border-primary">
                      <Swords className="w-5 h-5 mr-2" />
                      Join Team
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Stats Row */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.5,
              duration: 0.6
            }} className="mt-12 flex flex-wrap gap-8">
                {[{
                value: '$500+',
                label: 'PRIZES WON'
              }, {
                value: '50+',
                label: 'ACTIVE PLAYERS'
              }, {
                value: '12',
                label: 'TOURNAMENT WINS'
              }].map((stat, index) => <div key={stat.label} className="accent-border-left pl-4">
                    <div className="text-3xl md:text-4xl font-display font-black text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>)}
              </motion.div>
            </div>

            {/* Right Sidebar Info */}
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            duration: 0.8,
            delay: 0.3
          }} className="flex flex-col gap-5">
              {/* Live Tournament Card */}
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-green-400">Live Tournament</span>
                </div>
                <h3 className="font-display font-bold text-xl mb-2">Weekly Cash Cup</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Compete in Fortnite Ranked for real money prizes
                </p>
                <div className="power-bar mb-3">
                  <div className="power-bar-fill" style={{
                  width: '65%'
                }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Prize Pool: $25+</span>
                  <span>Entry: 250 FP</span>
                </div>
              </div>

              {/* Team Card */}
              <div className="stat-card">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex -space-x-3">
                    {teamMembers.map((member, index) => <div key={member.name} className="w-12 h-12 rounded-full border-3 border-background bg-muted overflow-hidden ring-2 ring-fused-purple/30" style={{
                    zIndex: teamMembers.length - index
                  }}>
                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                      </div>)}
                  </div>
                  <span className="text-sm font-semibold ml-2">+50 Members</span>
                </div>

                <div className="flex gap-2">
                  <Link to="/feed" className="flex-1">
                    <Button size="sm" className="w-full rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 font-display font-bold uppercase text-xs">
                      <Target className="w-4 h-4 mr-1" />
                      View Team
                    </Button>
                  </Link>
                  <a href="https://discord.gg/fusedupesports" target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button size="sm" className="w-full rounded-lg bg-[#5865F2] hover:bg-[#4752C4] border-0 font-display font-bold uppercase text-xs">
                      Join Discord
                    </Button>
                  </a>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="stat-card text-center py-4">
                  <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-display font-black">12</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Wins</div>
                </div>
                <div className="stat-card text-center py-4">
                  <Users className="w-6 h-6 mx-auto mb-2 text-fused-purple" />
                  <div className="text-2xl font-display font-black">50+</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Players</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 1.5
        }} className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <motion.div animate={{
            y: [0, 8, 0]
          }} transition={{
            duration: 2,
            repeat: Infinity
          }} className="flex flex-col items-center gap-2 text-muted-foreground">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold">Scroll</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 lg:px-8 relative">
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
            <h2 className="esports-title text-5xl md:text-6xl mb-4">
              WHY <span className="gradient-text">FUSED UP</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              More than just a team. We're a community of passionate gamers pushing each other to greatness.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[{
            icon: Trophy,
            title: 'COMPETE & RISE',
            description: 'Join our competitive roster and prove your skills in tournaments.'
          }, {
            icon: Users,
            title: 'COMMUNITY FIRST',
            description: 'Connect with fellow gamers, share highlights, and grow together.'
          }, {
            icon: Zap,
            title: 'EARN REWARDS',
            description: 'Gain Fused Points through activity and unlock exclusive items.'
          }].map((feature, index) => <motion.div key={feature.title} initial={{
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
                <div className="stat-card h-full hover:scale-[1.02] transition-transform duration-300">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-fused-purple to-fused-blue flex items-center justify-center mb-6 shadow-lg shadow-fused-purple/30">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-3 uppercase tracking-wide">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Team Tiers Section */}
      <section className="py-24 px-4 lg:px-8">
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
            <h2 className="esports-title text-5xl md:text-6xl mb-4">
              COMPETITIVE <span className="gradient-text">TIERS</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
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
                <div className="stat-card text-center h-full hover:scale-[1.02] transition-transform duration-300">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${tier.color} mx-auto mb-6 flex items-center justify-center shadow-xl`}>
                    <tier.icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="font-display font-black text-2xl mb-2 uppercase">{tier.name}</h3>
                  <p className={`text-xl font-display font-bold mb-4 bg-gradient-to-r ${tier.color} bg-clip-text text-transparent`}>
                    {tier.prRange}
                  </p>
                  <p className="text-muted-foreground">{tier.description}</p>
                </div>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-24 px-4 lg:px-8">
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
            <h2 className="esports-title text-5xl md:text-6xl mb-4">
              OUR <span className="gradient-text">PARTNERS</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by the best brands in gaming gear.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {partners.map((partner, index) => <motion.div key={partner.name} initial={{
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
                <div className="stat-card h-full hover:scale-[1.01] transition-transform duration-300">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden bg-white/5">
                      <img src={partner.logo} alt={partner.name} className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-display font-bold text-xl mb-2 uppercase">{partner.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{partner.description}</p>
                      <a href={partner.url} target="_blank" rel="noopener noreferrer">
                        <Button className="rounded-lg px-6 font-display font-bold uppercase text-sm bg-gradient-to-r from-fused-purple to-fused-blue hover:opacity-90 group border-0">
                          Use Code: {partner.code}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </div>

          {/* DUBBY Partner */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }}>
            <div className="stat-card p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-fused-purple/20 blur-xl rounded-xl" />
                  <img src="/images/dubby-banner.png" alt="DUBBY" className="relative w-48 md:w-64 rounded-xl" />
                </div>
                <div className="text-center md:text-left">
                  <span className="tournament-badge mb-4 inline-block">
                    Official Partner
                  </span>
                  <h3 className="font-display font-black text-3xl mb-4 uppercase">Fuel Your Grind</h3>
                  <p className="text-muted-foreground mb-6">
                    Get 10% off your DUBBY order and stay energized for those late-night sessions.
                  </p>
                  <a href="https://www.dubby.gg/discount/FusedUp?ref__=rnkmqges" target="_blank" rel="noopener noreferrer">
                    <Button className="rounded-lg px-6 font-display font-bold uppercase bg-gradient-to-r from-fused-purple to-fused-blue hover:opacity-90 group border-0">
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
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fused-purple/50 to-transparent" />

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            <div className="flex items-center gap-3">
              <img src="/images/fused-logo.png" alt="Fused Up" className="w-12 h-12" />
              <span className="font-display font-black text-2xl gradient-text uppercase tracking-wider">FUSED UP</span>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {['Discord', 'YouTube', 'Twitter', 'TikTok', 'Instagram'].map(social => <a key={social} href="#" className="text-muted-foreground hover:text-primary transition-colors relative group font-semibold uppercase text-sm tracking-wide">
                  {social}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-fused-purple to-fused-blue group-hover:w-full transition-all duration-300" />
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