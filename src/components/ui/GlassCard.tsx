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
}

export default function GlassCard({ 
  children, 
  className, 
  hover = true, 
  glow = false, 
  onClick, 
  animate = true 
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover && animate ? { scale: 1.01, y: -2 } : undefined}
      whileTap={onClick && animate ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-2xl",
        "bg-gradient-to-br from-white/[0.08] to-white/[0.02]",
        "backdrop-blur-xl",
        "border border-white/10",
        hover && "hover:border-fused-purple/30 hover:bg-white/[0.1] transition-all duration-300",
        glow && "shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:shadow-[0_0_50px_rgba(139,92,246,0.25)]",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-fused-purple/5 via-transparent to-fused-pink/5 pointer-events-none" />
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      
      {/* Top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fused-purple/50 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
