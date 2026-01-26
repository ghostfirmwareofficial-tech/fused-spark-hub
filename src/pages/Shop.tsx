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
  Check,
  ShoppingBag,
  Crown,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PointsDisplay from '@/components/ui/PointsDisplay';
import { BackgroundPreview } from '@/components/ui/ProfileBackground';
import { useShop, SHOP_ITEMS, ShopItem } from '@/hooks/useShop';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

type Category = 'all' | 'clan_tag' | 'badge' | 'nameplate' | 'boost' | 'background';
type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

const categories = [
  { id: 'all' as const, name: 'All Items', icon: Sparkles },
  { id: 'clan_tag' as const, name: 'Clan Tags', icon: Tag },
  { id: 'badge' as const, name: 'Badges', icon: Award },
  { id: 'background' as const, name: 'Backgrounds', icon: Palette },
  { id: 'boost' as const, name: 'Boosts', icon: Rocket },
];

const rarityConfig: Record<Rarity, { label: string; gradient: string; border: string; glow: string }> = {
  common: { 
    label: 'Common', 
    gradient: 'from-gray-500/20 to-gray-600/10',
    border: 'border-gray-500/30',
    glow: ''
  },
  uncommon: { 
    label: 'Uncommon', 
    gradient: 'from-green-500/20 to-green-600/10',
    border: 'border-green-500/30',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]'
  },
  rare: { 
    label: 'Rare', 
    gradient: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_25px_rgba(59,130,246,0.2)]'
  },
  epic: { 
    label: 'Epic', 
    gradient: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/40',
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.25)]'
  },
  legendary: { 
    label: 'Legendary', 
    gradient: 'from-yellow-500/20 via-orange-500/15 to-yellow-600/10',
    border: 'border-yellow-500/50',
    glow: 'shadow-[0_0_40px_rgba(234,179,8,0.3)]'
  },
};

export default function Shop() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const { 
    userPoints, 
    purchasedItems, 
    canAfford, 
    meetsRankRequirement, 
    isOwned,
    purchaseItem 
  } = useShop();

  const filteredItems = activeCategory === 'all' 
    ? SHOP_ITEMS 
    : SHOP_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Glass Header Card */}
          <div className="liquid-glass-header rounded-2xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-fused-purple to-fused-pink flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    Fused <span className="gradient-text">Shop</span>
                  </h1>
                  <p className="text-muted-foreground">
                    Spend your Fused Points on exclusive items
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-black/30 rounded-xl px-4 py-3 border border-white/10">
                <span className="text-muted-foreground text-sm">Your Balance:</span>
                <PointsDisplay points={userPoints} size="lg" />
              </div>
            </div>
          </div>

          {/* Categories with liquid glass effect */}
          <div className="liquid-glass-tabs relative rounded-xl p-2 flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 z-10",
                  activeCategory === category.id
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeCategory === category.id && (
                  <motion.div
                    layoutId="shop-category-bg"
                    className="absolute inset-0 bg-gradient-to-r from-fused-purple to-fused-pink rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <category.icon className="w-4 h-4 relative z-10" />
                <span className="text-sm font-medium relative z-10">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Items Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <ShopItemCard
                key={item.id}
                item={item}
                index={index}
                isOwned={isOwned(item.id)}
                canAfford={canAfford(item.price)}
                meetsRank={meetsRankRequirement(item.required_rank)}
                onPurchase={() => purchaseItem.mutate(item)}
                isPurchasing={purchaseItem.isPending}
                isLoggedIn={!!user}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Owned Items Section */}
        {purchasedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <Crown className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold">Your Collection</h2>
              <span className="text-sm text-muted-foreground">({purchasedItems.length} items)</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {purchasedItems.map((itemId) => {
                const item = SHOP_ITEMS.find(i => i.id === itemId);
                if (!item) return null;
                return (
                  <motion.div
                    key={itemId}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-4 py-2 rounded-lg bg-fused-purple/20 border border-fused-purple/30 text-sm font-medium"
                  >
                    {item.name}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

interface ShopItemCardProps {
  item: ShopItem;
  index: number;
  isOwned: boolean;
  canAfford: boolean;
  meetsRank: boolean;
  onPurchase: () => void;
  isPurchasing: boolean;
  isLoggedIn: boolean;
}

function ShopItemCard({ 
  item, 
  index, 
  isOwned, 
  canAfford, 
  meetsRank, 
  onPurchase,
  isPurchasing,
  isLoggedIn
}: ShopItemCardProps) {
  const rarity = rarityConfig[item.rarity];
  const canBuy = isLoggedIn && canAfford && meetsRank && !isOwned;
  const isBackground = item.category === 'background';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      layout
      className="h-full"
    >
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className={cn(
          "relative h-full rounded-2xl overflow-hidden backdrop-blur-xl",
          "bg-gradient-to-br",
          rarity.gradient,
          "border-2",
          rarity.border,
          rarity.glow,
          isOwned && "ring-2 ring-green-500/50"
        )}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
        
        <div className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm",
              item.rarity === 'common' && "bg-gray-500/30 text-gray-300",
              item.rarity === 'uncommon' && "bg-green-500/30 text-green-300",
              item.rarity === 'rare' && "bg-blue-500/30 text-blue-300",
              item.rarity === 'epic' && "bg-purple-500/30 text-purple-300",
              item.rarity === 'legendary' && "bg-gradient-to-r from-yellow-500/40 to-orange-500/40 text-yellow-200",
            )}>
              {rarity.label}
            </span>
            <div className="flex gap-2">
              {item.is_limited && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/30 text-red-300">
                  Limited
                </span>
              )}
              {isOwned && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/30 text-green-300 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Owned
                </motion.span>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="flex-1 flex items-center justify-center py-6 min-h-[120px]">
            {isBackground ? (
              <BackgroundPreview 
                backgroundId={item.id} 
                className="w-full h-24 rounded-lg" 
              />
            ) : (
              <motion.span 
                className={cn(
                  "text-3xl font-bold",
                  item.category === 'clan_tag' && "text-fused-purple",
                  item.category === 'badge' && "text-4xl",
                )}
                animate={item.rarity === 'legendary' ? {
                  textShadow: [
                    '0 0 20px rgba(234,179,8,0.5)',
                    '0 0 40px rgba(234,179,8,0.8)',
                    '0 0 20px rgba(234,179,8,0.5)',
                  ]
                } : undefined}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {item.preview_value}
              </motion.span>
            )}
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div>
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
            </div>

            {/* Rank Requirement */}
            {item.required_rank !== 'Recruit' && (
              <div className={cn(
                "flex items-center gap-2 text-sm",
                meetsRank ? "text-muted-foreground" : "text-red-400"
              )}>
                <Lock className="w-4 h-4" />
                <span>Requires {item.required_rank}</span>
                {meetsRank && <Check className="w-4 h-4 text-green-400" />}
              </div>
            )}

            {/* Price & Buy Button */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-lg text-yellow-400">{item.price.toLocaleString()}</span>
                <span className="text-sm text-yellow-400/70">FP</span>
              </div>
              <Button
                size="sm"
                disabled={!canBuy || isPurchasing}
                onClick={onPurchase}
                className={cn(
                  "px-4 transition-all duration-300",
                  canBuy 
                    ? "bg-gradient-to-r from-fused-purple to-fused-pink hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] text-white"
                    : "bg-white/10 text-muted-foreground"
                )}
              >
                {isPurchasing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isOwned ? (
                  'Owned'
                ) : !isLoggedIn ? (
                  'Login'
                ) : !meetsRank ? (
                  'Locked'
                ) : canAfford ? (
                  <>
                    <ShoppingBag className="w-4 h-4 mr-1" />
                    Buy
                  </>
                ) : (
                  'Need More FP'
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
