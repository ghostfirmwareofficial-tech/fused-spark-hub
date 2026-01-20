import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PointsDisplayProps {
  points: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const sizes = {
  sm: { icon: 'w-3 h-3', text: 'text-sm', padding: 'px-2 py-1' },
  md: { icon: 'w-4 h-4', text: 'text-base', padding: 'px-3 py-1.5' },
  lg: { icon: 'w-5 h-5', text: 'text-lg', padding: 'px-4 py-2' },
  xl: { icon: 'w-6 h-6', text: 'text-2xl', padding: 'px-5 py-2.5' }
};

export default function PointsDisplay({ points, size = 'md', animate = true }: PointsDisplayProps) {
  const s = sizes[size];

  return (
    <motion.div
      initial={animate ? { scale: 0.9, opacity: 0 } : undefined}
      animate={animate ? { scale: 1, opacity: 1 } : undefined}
      whileHover={animate ? { scale: 1.05 } : undefined}
      className={cn(
        "points-display",
        s.padding
      )}
    >
      <Zap className={cn(s.icon, "text-yellow-400 fill-yellow-400")} />
      <span className={cn(s.text, "font-bold text-yellow-400")}>
        {points?.toLocaleString() || 0}
      </span>
      <span className="text-sm text-yellow-400/70 font-medium">FP</span>
    </motion.div>
  );
}
