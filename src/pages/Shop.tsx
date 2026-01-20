import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag,
  Award,
  Sparkles,
  Rocket,
  Palette,
  Lock,
  Zap,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GlassCard from '@/components/ui/GlassCard';
import PointsDisplay from '@/components/ui/PointsDisplay';
import { cn } from '@/lib/utils';

type Category = 'all' | 'clan_tag' | 'badge' | 'nameplate' | 'boost' | 'background';
type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: Category;
  price: number;
  preview_value: string;
  required_rank: string;
  rarity: Rarity;
  is_limited?: boolean;
}

const mockItems: ShopItem[] = [
  {
    id: '1',
    name: '[FUSE]',
    description: 'The official Fused Up clan tag. Show your pride!',
    category: 'clan_tag',
    price: 250,
    preview_value: '[FUSE]',
    required_rank: 'Recruit',
    rarity: 'common',
  },
  {
    id: '2',
    name: '[FUSED]',
    description: 'The full Fused Up clan tag. Premium style.',
    category: 'clan_tag',
    price: 500,
    preview_value: '[FUSED]',
    required_rank: 'Grinder',
    rarity: 'uncommon',
  },
  {
    id: '3',
    name: '[CORE]',
    description: 'Exclusive clan tag for elite members.',
    category: 'clan_tag',
    price: 1500,
    preview_value: '[CORE]',
    required_rank: 'Elite',
    rarity: 'epic',
  },
  {
    id: '4',
    name: 'Grinder Badge',
    description: 'Show everyone you put in the work.',
    category: 'badge',
    price: 300,
    preview_value: '🎯 Grinder',
    required_rank: 'Grinder',
    rarity: 'uncommon',
  },
  {
    id: '5',
    name: 'Champion Badge',
    description: 'Reserved for tournament winners.',
    category: 'badge',
    price: 2000,
    preview_value: '🏆 Champion',
    required_rank: 'Elite',
    rarity: 'legendary',
  },
  {
    id: '6',
    name: 'Highlight Boost',
    description: 'Boost your next highlight post to the top.',
    category: 'boost',
    price: 500,
    preview_value: '⚡ Boosted',
    required_rank: 'Recruit',
    rarity: 'rare',
  },
];

const categories = [
  { id: 'all' as const, name: 'All Items', icon: Sparkles },
  { id: 'clan_tag' as const, name: 'Clan Tags', icon: Tag },
  { id: 'badge' as const, name: 'Badges', icon: Award },
  { id: 'nameplate' as const, name: 'Nameplates', icon: Award },
  { id: 'boost' as const, name: 'Boosts', icon: Rocket },
  { id: 'background' as const, name: 'Backgrounds', icon: Palette },
];

const rarityConfig: Record<Rarity, { label: string; className: string }> = {
  common: { label: 'Common', className: 'rarity-common' },
  uncommon: { label: 'Uncommon', className: 'rarity-uncommon' },
  rare: { label: 'Rare', className: 'rarity-rare' },
  epic: { label: 'Epic', className: 'rarity-epic' },
  legendary: { label: 'Legendary', className: 'rarity-legendary' },
};

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [userPoints] = useState(1250); // Mock user points

  const filteredItems = activeCategory === 'all' 
    ? mockItems 
    : mockItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Fused <span className="gradient-text">Shop</span>
            </h1>
            <p className="text-muted-foreground">
              Spend your Fused Points on exclusive items
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">Your Balance:</span>
            <PointsDisplay points={userPoints} size="lg" />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
                activeCategory === category.id
                  ? "bg-fused-purple/20 text-fused-purple border border-fused-purple/30"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-transparent"
              )}
            >
              <category.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Items Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const rarity = rarityConfig[item.rarity];
              const canAfford = userPoints >= item.price;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <GlassCard 
                    className={cn("p-6 h-full border-2", rarity.className)}
                    glow={item.rarity === 'legendary' || item.rarity === 'epic'}
                  >
                    <div className="flex flex-col h-full">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-medium",
                          item.rarity === 'common' && "bg-gray-500/20 text-gray-400",
                          item.rarity === 'uncommon' && "bg-green-500/20 text-green-400",
                          item.rarity === 'rare' && "bg-blue-500/20 text-blue-400",
                          item.rarity === 'epic' && "bg-purple-500/20 text-purple-400",
                          item.rarity === 'legendary' && "bg-yellow-500/20 text-yellow-400",
                        )}>
                          {rarity.label}
                        </span>
                        {item.is_limited && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-400">
                            Limited
                          </span>
                        )}
                      </div>

                      {/* Preview */}
                      <div className="flex-1 flex items-center justify-center py-6">
                        <span className={cn(
                          "text-2xl font-bold",
                          item.category === 'clan_tag' && "text-fused-purple",
                          item.category === 'badge' && "text-3xl",
                        )}>
                          {item.preview_value}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>

                        {/* Rank Requirement */}
                        {item.required_rank !== 'Recruit' && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Lock className="w-4 h-4" />
                            <span>Requires {item.required_rank}</span>
                          </div>
                        )}

                        {/* Price & Buy Button */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-bold text-yellow-400">{item.price}</span>
                            <span className="text-sm text-muted-foreground">FP</span>
                          </div>
                          <Button
                            size="sm"
                            disabled={!canAfford}
                            className={cn(
                              canAfford 
                                ? "bg-gradient-to-r from-fused-purple to-fused-pink hover:opacity-90 text-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {canAfford ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Purchase
                              </>
                            ) : (
                              'Not enough FP'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
