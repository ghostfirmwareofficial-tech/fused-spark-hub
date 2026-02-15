import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Linkedin, Facebook, Instagram, ArrowRight } from 'lucide-react';

const socialLinks = [
  { icon: Linkedin, url: 'https://linkedin.com' },
  { icon: Facebook, url: 'https://facebook.com' },
  { icon: Instagram, url: 'https://instagram.com/fusedupesports' },
];

export default function LeftSidebar() {
  return (
    <motion.aside 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden lg:flex fixed left-0 top-0 bottom-0 w-24 flex-col items-center justify-between py-8 z-40"
    >
      {/* Logo & Brand */}
      <div className="flex flex-col items-center gap-4">
        <Link to="/" className="relative group">
          <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center overflow-hidden">
            <img 
              src="/images/fused-logo.png" 
              alt="Fused Up" 
              className="w-8 h-8 object-contain"
            />
          </div>
        </Link>
        
        {/* Vertical Brand Text */}
        <div className="vertical-text text-sm font-bold tracking-[0.3em] text-muted-foreground uppercase">
          <span className="text-foreground">FUSED</span>
          <span className="text-primary ml-1">UP</span>
        </div>
      </div>

      {/* Center Section - Description */}
      <div className="flex flex-col items-center gap-6">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-border to-transparent" />
        
        <div className="vertical-text text-xs text-muted-foreground max-w-[200px] text-center leading-relaxed">
          FOLLOW US
        </div>
        
        <p className="vertical-text text-[10px] text-muted-foreground/60 max-w-[180px] leading-relaxed">
          Clean branding, smarter features, and a better community experience.
        </p>

        {/* Social Links */}
        <div className="flex flex-col items-center gap-3 mt-4">
          {socialLinks.map((social, index) => (
            <motion.a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all duration-300"
            >
              <social.icon className="w-4 h-4" />
            </motion.a>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <Link 
        to="/apply"
        className="cta-button group"
      >
        <span className="text-xs font-medium whitespace-nowrap">Apply</span>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
          <ArrowRight className="w-4 h-4 text-primary-foreground" />
        </div>
      </Link>
    </motion.aside>
  );
}