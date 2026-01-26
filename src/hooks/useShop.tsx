import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useProfile } from './useProfile';
import { toast } from 'sonner';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'clan_tag' | 'badge' | 'nameplate' | 'boost' | 'background';
  price: number;
  preview_value: string;
  required_rank: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  is_limited?: boolean;
  background_css?: string;
}

// Shop items data
export const SHOP_ITEMS: ShopItem[] = [
  // Clan Tags
  {
    id: 'clan_fuse',
    name: '[FUSE]',
    description: 'The official Fused Up clan tag. Show your pride!',
    category: 'clan_tag',
    price: 250,
    preview_value: '[FUSE]',
    required_rank: 'Recruit',
    rarity: 'common',
  },
  {
    id: 'clan_fused',
    name: '[FUSED]',
    description: 'The full Fused Up clan tag. Premium style.',
    category: 'clan_tag',
    price: 500,
    preview_value: '[FUSED]',
    required_rank: 'Grinder',
    rarity: 'uncommon',
  },
  {
    id: 'clan_core',
    name: '[CORE]',
    description: 'Exclusive clan tag for elite members.',
    category: 'clan_tag',
    price: 1500,
    preview_value: '[CORE]',
    required_rank: 'Elite',
    rarity: 'epic',
  },
  // Badges
  {
    id: 'badge_grinder',
    name: 'Grinder Badge',
    description: 'Show everyone you put in the work.',
    category: 'badge',
    price: 300,
    preview_value: '🎯 Grinder',
    required_rank: 'Grinder',
    rarity: 'uncommon',
  },
  {
    id: 'badge_champion',
    name: 'Champion Badge',
    description: 'Reserved for tournament winners.',
    category: 'badge',
    price: 2000,
    preview_value: '🏆 Champion',
    required_rank: 'Elite',
    rarity: 'legendary',
  },
  // Boosts
  {
    id: 'boost_highlight',
    name: 'Highlight Boost',
    description: 'Boost your next highlight post to the top.',
    category: 'boost',
    price: 500,
    preview_value: '⚡ Boosted',
    required_rank: 'Recruit',
    rarity: 'rare',
  },
  // Profile Backgrounds
  {
    id: 'bg_galaxy',
    name: 'Cosmic Galaxy',
    description: 'An animated galaxy background with swirling stars and nebulas.',
    category: 'background',
    price: 1000,
    preview_value: '🌌',
    required_rank: 'Grinder',
    rarity: 'rare',
    background_css: 'bg-galaxy',
  },
  {
    id: 'bg_fused_lightning',
    name: 'Fused Lightning',
    description: 'Purple lightning storms with the Fused Up energy.',
    category: 'background',
    price: 2500,
    preview_value: '⚡',
    required_rank: 'Challenger',
    rarity: 'epic',
    background_css: 'bg-fused-lightning',
  },
  {
    id: 'bg_elite_glow',
    name: 'Elite Glow',
    description: 'A pristine white and gold glowing aura for the elite.',
    category: 'background',
    price: 5000,
    preview_value: '✨',
    required_rank: 'Elite',
    rarity: 'legendary',
    is_limited: true,
    background_css: 'bg-elite-glow',
  },
];

const RANK_ORDER = ['Recruit', 'Grinder', 'Challenger', 'Elite', 'Fused Core', 'Ascended'];

export function useShop() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const queryClient = useQueryClient();

  const purchasedItems = profile?.purchased_items || [];
  const userPoints = profile?.fused_points || 0;
  const userRank = profile?.rank || 'Recruit';

  const userRankIndex = RANK_ORDER.indexOf(userRank);

  const canAfford = (price: number) => userPoints >= price;
  
  const meetsRankRequirement = (requiredRank: string) => {
    const requiredIndex = RANK_ORDER.indexOf(requiredRank);
    return userRankIndex >= requiredIndex;
  };

  const isOwned = (itemId: string) => purchasedItems.includes(itemId);

  const purchaseItem = useMutation({
    mutationFn: async (item: ShopItem) => {
      if (!user || !profile) throw new Error('Not authenticated');
      if (!canAfford(item.price)) throw new Error('Not enough points');
      if (!meetsRankRequirement(item.required_rank)) throw new Error('Rank requirement not met');
      if (isOwned(item.id)) throw new Error('Already owned');

      const newPoints = profile.fused_points - item.price;
      const newPurchasedItems = [...purchasedItems, item.id];

      const { error } = await supabase
        .from('profiles')
        .update({
          fused_points: newPoints,
          purchased_items: newPurchasedItems,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      return item;
    },
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success(`Purchased ${item.name}!`, {
        description: `You can now equip this item from your profile.`,
      });
    },
    onError: (error) => {
      toast.error('Purchase failed', { description: error.message });
    },
  });

  const equipItem = useMutation({
    mutationFn: async ({ category, itemId }: { category: string; itemId: string | null }) => {
      if (!user || !profile) throw new Error('Not authenticated');
      
      const currentEquipped = (profile.equipped_items as Record<string, string>) || {};
      const newEquipped = { ...currentEquipped };
      
      if (itemId === null) {
        delete newEquipped[category];
      } else {
        newEquipped[category] = itemId;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ equipped_items: newEquipped })
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Item equipped!');
    },
    onError: (error) => {
      toast.error('Failed to equip item', { description: error.message });
    },
  });

  return {
    items: SHOP_ITEMS,
    purchasedItems,
    userPoints,
    userRank,
    canAfford,
    meetsRankRequirement,
    isOwned,
    purchaseItem,
    equipItem,
  };
}
