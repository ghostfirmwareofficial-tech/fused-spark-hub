import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
  animate?: boolean;
  variant?: 'default' | 'accent' | 'bordered' | 'minimal';
}

export default function GlassCard({ 
  children, 
  className, 
  hover = true, 
  glow = false, 
  onClick, 
  animate = true,
  variant = 'default'
}: GlassCardProps) {
  const variants = {
    default: "bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/10",
    accent: "bg-gradient-to-br from-fused-purple/10 to-fused-pink/5 border border-fused-purple/20",
    bordered: "bg-black/40 border-2 border-fused-purple/30",
    minimal: "bg-white/[0.03] border border-white/5"
  };

  return (
    <motion.div
      whileHover={hover && animate ? { scale: 1.01 } : undefined}
      whileTap={onClick && animate ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl backdrop-blur-md",
        variants[variant],
        hover && "transition-all duration-300",
        hover && "hover:border-fused-purple/40",
        glow && "shadow-[0_0_20px_rgba(139,92,246,0.1)]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-fused-purple/40 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-fused-pink/40 rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-fused-pink/40 rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-fused-purple/40 rounded-br-2xl" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
