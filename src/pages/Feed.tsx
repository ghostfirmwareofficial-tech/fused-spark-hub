import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image,
  Video,
  Send,
  TrendingUp,
  X,
  Loader2,
  Search,
  Sparkles,
  Clock,
  Flame,
  PlusCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import GlassCard from '@/components/ui/GlassCard';
import PostCard from '@/components/feed/PostCard';
import TeamUpSection from '@/components/feed/TeamUpSection';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

const trendingHashtags = ['#Fortnite', '#FusedUp', '#Highlights', '#Competitive', '#Victory'];

type FeedFilter = 'new' | 'trending' | 'for-you';

const feedTabs = [
  { id: 'for-you' as const, label: 'For You', icon: Sparkles },
  { id: 'new' as const, label: 'New', icon: Clock },
  { id: 'trending' as const, label: 'Trending', icon: Flame },
];

export default function Feed() {
  const { user } = useAuth();
  const { posts, isLoading, createPost, deletePost } = usePosts();
  const [newPost, setNewPost] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FeedFilter>('for-you');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  const handleSubmit = async () => {
    if (!newPost.trim() && !imageFile && !videoFile) return;
    await createPost.mutateAsync({ content: newPost, imageFile: imageFile || undefined, videoFile: videoFile || undefined });
    setNewPost('');
    setImageFile(null);
    setVideoFile(null);
    setImagePreview(null);
    setShowCreatePost(false);
  };

  const handleDeletePost = (postId: string) => {
    deletePost.mutate(postId);
  };

  // Filter and sort posts based on search and active filter
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(query) ||
        post.profiles?.ign?.toLowerCase().includes(query)
      );
    }

    // Sort based on active filter
    switch (activeFilter) {
      case 'new':
        filtered.sort((a, b) => {
          // Pinned first, then by date
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        break;
      case 'trending':
        filtered.sort((a, b) => {
          // Pinned first, then by engagement (likes + comments + reposts)
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          const aEngagement = (a.likes_count || 0) + (a.comments_count || 0) + (a.reposts_count || 0);
          const bEngagement = (b.likes_count || 0) + (b.comments_count || 0) + (b.reposts_count || 0);
          return bEngagement - aEngagement;
        });
        break;
      case 'for-you':
      default:
        // Mix of recent and trending - pinned first, then score by recency + engagement
        filtered.sort((a, b) => {
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          const aRecency = (Date.now() - new Date(a.created_at).getTime()) / (1000 * 60 * 60); // hours ago
          const bRecency = (Date.now() - new Date(b.created_at).getTime()) / (1000 * 60 * 60);
          const aEngagement = (a.likes_count || 0) + (a.comments_count || 0) * 2 + (a.reposts_count || 0) * 3;
          const bEngagement = (b.likes_count || 0) + (b.comments_count || 0) * 2 + (b.reposts_count || 0) * 3;
          const aScore = aEngagement / Math.max(1, Math.sqrt(aRecency));
          const bScore = bEngagement / Math.max(1, Math.sqrt(bRecency));
          return bScore - aScore;
        });
        break;
    }

    return filtered;
  }, [posts, searchQuery, activeFilter]);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Community <span className="gradient-text">Feed</span></h1>
          <p className="text-muted-foreground">Share highlights and connect</p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 rounded-full h-10"
              />
            </div>

            {/* Filter Tabs */}
            <div className="relative flex items-center bg-white/5 rounded-full p-1 border border-white/10">
              {/* Animated background indicator */}
              <motion.div
                className="absolute inset-y-1 rounded-full bg-gradient-to-r from-fused-purple to-fused-blue"
                layoutId="feedTabIndicator"
                style={{
                  width: `calc(100% / ${feedTabs.length} - 4px)`,
                  left: `calc(${feedTabs.findIndex(t => t.id === activeFilter)} * 100% / ${feedTabs.length} + 2px)`,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />
              {feedTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    "relative z-10 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                    activeFilter === tab.id
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* New Post Button */}
            {user && (
              <Button
                onClick={() => setShowCreatePost(!showCreatePost)}
                className={cn(
                  "rounded-full gap-2",
                  showCreatePost 
                    ? "bg-white/10 hover:bg-white/20" 
                    : "bg-gradient-to-r from-fused-purple to-fused-blue hover:opacity-90"
                )}
              >
                {showCreatePost ? (
                  <><X className="w-4 h-4" /> Cancel</>
                ) : (
                  <><PlusCircle className="w-4 h-4" /> New Post</>
                )}
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {/* Create Post - Collapsible */}
            <AnimatePresence>
              {user && showCreatePost && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <GlassCard className="p-6">
                    <Textarea
                      placeholder="Share your highlight... (+25 FP)"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="bg-white/5 border-white/10 resize-none min-h-[100px] mb-4"
                    />
                    {imagePreview && (
                      <div className="relative mb-4">
                        <img src={imagePreview} alt="Preview" className="rounded-lg max-h-48 object-cover" />
                        <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={() => { setImageFile(null); setImagePreview(null); }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    {videoFile && <p className="text-sm text-muted-foreground mb-4">📹 {videoFile.name}</p>}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                        <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
                        <Button variant="ghost" size="sm" onClick={() => imageInputRef.current?.click()}><Image className="w-5 h-5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => videoInputRef.current?.click()}><Video className="w-5 h-5" /></Button>
                      </div>
                      <Button onClick={handleSubmit} disabled={createPost.isPending || (!newPost.trim() && !imageFile && !videoFile)} className="bg-gradient-to-r from-fused-purple to-fused-blue">
                        {createPost.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" />Post</>}
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Posts */}
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-fused-purple" /></div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery ? `No posts found for "${searchQuery}"` : 'No posts yet. Be the first to share!'}
              </div>
            ) : (
              <AnimatePresence>
                {filteredPosts.map((post, index) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <PostCard post={post} onDelete={handleDeletePost} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Team Up Section */}
            <TeamUpSection />

            {/* Trending */}
            <GlassCard className="p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-fused-purple" /><h3 className="font-semibold">Trending</h3></div>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((tag) => (
                  <button 
                    key={tag} 
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1.5 rounded-full bg-fused-purple/10 text-fused-purple text-sm hover:bg-fused-purple/20 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
