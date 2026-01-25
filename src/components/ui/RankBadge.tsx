import { motion } from 'framer-motion';
import { Crown, Star, Shield, Zap, Flame, Sparkles, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

type RankType = 'Recruit' | 'Grinder' | 'Challenger' | 'Elite' | 'Fused Core' | 'Ascended';

interface RankConfig {
  icon: LucideIcon;
  className: string;
}

const rankConfig: Record<RankType, RankConfig> = {
  'Recruit': { 
    icon: Shield, 
    className: 'rank-recruit',
  },
  'Grinder': { 
    icon: Zap, 
    className: 'rank-grinder',
  },
  'Challenger': { 
    icon: Flame, 
    className: 'rank-challenger',
  },
  'Elite': { 
    icon: Star, 
    className: 'rank-elite',
  },
  'Fused Core': { 
    icon: Crown, 
    className: 'rank-fused-core',
  },
  'Ascended': { 
    icon: Sparkles, 
    className: 'rank-ascended',
  }
};

interface RankBadgeProps {
  rank: RankType | string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizes = {
  sm: { icon: 'w-3 h-3', text: 'text-xs', padding: 'px-2 py-0.5', gap: 'gap-1' },
  md: { icon: 'w-4 h-4', text: 'text-sm', padding: 'px-3 py-1', gap: 'gap-1.5' },
  lg: { icon: 'w-5 h-5', text: 'text-base', padding: 'px-4 py-1.5', gap: 'gap-2' }
};

const RankBadge = forwardRef<HTMLDivElement, RankBadgeProps>(({ rank, size = 'md', showLabel = true }, ref) => {
  const config = rankConfig[rank as RankType] || rankConfig['Recruit'];
  const Icon = config.icon;
  const s = sizes[size];

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.05 }}
      className={cn(
        "inline-flex items-center rounded-full border",
        s.gap,
        s.padding,
        config.className
      )}
    >
      <Icon className={s.icon} />
      {showLabel && <span className={cn("font-medium", s.text)}>{rank}</span>}
    </motion.div>
  );
});

RankBadge.displayName = 'RankBadge';

export default RankBadge;
