import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShop, SHOP_ITEMS } from '@/hooks/useShop';
import { BackgroundPreview } from '@/components/ui/ProfileBackground';
import { Check, X, Palette, Tag, Award, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileCustomizationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equippedItems: Record<string, string> | null;
}

export default function ProfileCustomization({ open, onOpenChange, equippedItems }: ProfileCustomizationProps) {
  const { purchasedItems, equipItem } = useShop();
  const [selectedTab, setSelectedTab] = useState('background');

  const equipped = equippedItems || {};

  const ownedBackgrounds = SHOP_ITEMS.filter(
    item => item.category === 'background' && purchasedItems.includes(item.id)
  );
  const ownedTags = SHOP_ITEMS.filter(
    item => item.category === 'clan_tag' && purchasedItems.includes(item.id)
  );
  const ownedBadges = SHOP_ITEMS.filter(
    item => item.category === 'badge' && purchasedItems.includes(item.id)
  );

  const handleEquip = (category: string, itemId: string | null) => {
    equipItem.mutate({ category, itemId });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background/95 backdrop-blur-xl border-white/10 max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-fused-purple" />
            Customize Profile
          </DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-4">
          <TabsList className="w-full bg-white/5 p-1 rounded-xl">
            <TabsTrigger value="background" className="flex-1 gap-2 data-[state=active]:bg-fused-purple/20">
              <Palette className="w-4 h-4" />
              Backgrounds
            </TabsTrigger>
            <TabsTrigger value="clan_tag" className="flex-1 gap-2 data-[state=active]:bg-fused-purple/20">
              <Tag className="w-4 h-4" />
              Clan Tags
            </TabsTrigger>
            <TabsTrigger value="badge" className="flex-1 gap-2 data-[state=active]:bg-fused-purple/20">
              <Award className="w-4 h-4" />
              Badges
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 max-h-[50vh] overflow-y-auto pr-2">
            <TabsContent value="background" className="mt-0">
              <div className="space-y-4">
                {/* Default option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleEquip('background', null)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 cursor-pointer transition-all",
                    !equipped.background
                      ? "border-fused-purple bg-fused-purple/10"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Default</h4>
                      <p className="text-sm text-muted-foreground">Standard profile background</p>
                    </div>
                    {!equipped.background && (
                      <div className="w-8 h-8 rounded-full bg-fused-purple flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Owned backgrounds */}
                {ownedBackgrounds.length > 0 ? (
                  <div className="grid gap-4">
                    {ownedBackgrounds.map((item) => (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleEquip('background', item.id)}
                        className={cn(
                          "relative rounded-xl border-2 cursor-pointer overflow-hidden transition-all",
                          equipped.background === item.id
                            ? "border-fused-purple"
                            : "border-white/10 hover:border-white/20"
                        )}
                      >
                        <BackgroundPreview backgroundId={item.id} className="h-24" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-white">{item.name}</h4>
                            <p className="text-xs text-white/70">{item.description}</p>
                          </div>
                          {equipped.background === item.id && (
                            <div className="w-8 h-8 rounded-full bg-fused-purple flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Palette className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No backgrounds owned yet</p>
                    <p className="text-sm">Visit the shop to purchase backgrounds!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="clan_tag" className="mt-0">
              <div className="space-y-3">
                {/* Default option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleEquip('clan_tag', null)}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between",
                    !equipped.clan_tag
                      ? "border-fused-purple bg-fused-purple/10"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  <div>
                    <h4 className="font-semibold">No Clan Tag</h4>
                    <p className="text-sm text-muted-foreground">Display name only</p>
                  </div>
                  {!equipped.clan_tag && (
                    <div className="w-8 h-8 rounded-full bg-fused-purple flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>

                {ownedTags.length > 0 ? (
                  ownedTags.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleEquip('clan_tag', item.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between",
                        equipped.clan_tag === item.id
                          ? "border-fused-purple bg-fused-purple/10"
                          : "border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold text-fused-purple">{item.preview_value}</span>
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      {equipped.clan_tag === item.id && (
                        <div className="w-8 h-8 rounded-full bg-fused-purple flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No clan tags owned yet</p>
                    <p className="text-sm">Visit the shop to purchase clan tags!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="badge" className="mt-0">
              <div className="space-y-3">
                {/* Default option */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleEquip('badge', null)}
                  className={cn(
                    "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between",
                    !equipped.badge
                      ? "border-fused-purple bg-fused-purple/10"
                      : "border-white/10 hover:border-white/20"
                  )}
                >
                  <div>
                    <h4 className="font-semibold">No Badge</h4>
                    <p className="text-sm text-muted-foreground">Hide badge from profile</p>
                  </div>
                  {!equipped.badge && (
                    <div className="w-8 h-8 rounded-full bg-fused-purple flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>

                {ownedBadges.length > 0 ? (
                  ownedBadges.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleEquip('badge', item.id)}
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between",
                        equipped.badge === item.id
                          ? "border-fused-purple bg-fused-purple/10"
                          : "border-white/10 hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{item.preview_value}</span>
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      {equipped.badge === item.id && (
                        <div className="w-8 h-8 rounded-full bg-fused-purple flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No badges owned yet</p>
                    <p className="text-sm">Visit the shop to purchase badges!</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-white/10"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
