import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share,
  Star,
  CheckCircle,
  Image,
  Video,
  Send,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import GlassCard from '@/components/ui/GlassCard';
import RankBadge from '@/components/ui/RankBadge';
import VideoBackground from '@/components/ui/VideoBackground';

// Mock posts data
const mockPosts = [
  {
    id: '1',
    author_ign: 'FusedUp Official',
    author_rank: 'Ascended',
    author_role: 'Admin',
    content: 'Welcome to the Fused Up community! 🔥\n\nWe\'re so hyped to have you here. This is your hub to connect, share highlights, and grind together.\n\nDrop a comment below and introduce yourself!\n\n#Fortnite #FusedUp #Welcome',
    likes_count: 24,
    comments_count: 8,
    reposts_count: 3,
    is_featured: true,
    created_date: new Date().toISOString(),
  },
  {
    id: '2',
    author_ign: 'FusedUp Official',
    author_rank: 'Ascended',
    author_role: 'Admin',
    content: '🚨 RECRUITMENT OPEN 🚨\n\nWe\'re looking for:\n• Competitive players (50+ PR)\n• Content creators (150+ followers)\n• Creative editors\n• Community moderators\n\nThink you have what it takes? Hit that Apply button!\n\n#Recruitment #Fortnite',
    likes_count: 45,
    comments_count: 12,
    reposts_count: 8,
    is_featured: true,
    created_date: new Date(Date.now() - 86400000).toISOString(),
  },
];

const trendingHashtags = ['#Fortnite', '#FusedUp', '#Highlights', '#Competitive', '#Victory'];

export default function Feed() {
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Staff': 'text-red-400',
      'Admin': 'text-red-400',
      'Competitive': 'text-blue-400',
      'Creator': 'text-pink-400',
      'Member': 'text-muted-foreground'
    };
    return colors[role] || 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen py-8 px-4 relative">
      <VideoBackground opacity={0.2} />
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Community <span className="gradient-text">Feed</span>
          </h1>
          <p className="text-muted-foreground">
            Share your highlights and connect with the community
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-6">
            {/* Create Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <GlassCard className="p-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-fused-purple/30 flex items-center justify-center border border-fused-purple/50 flex-shrink-0">
                    <span className="text-fused-purple font-semibold">?</span>
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your highlight... (+25 FP)"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      className="bg-white/5 border-white/10 text-foreground resize-none min-h-[100px]"
                    />
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-fused-purple">
                          <Image className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-fused-purple">
                          <Video className="w-5 h-5" />
                        </Button>
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-fused-purple to-fused-pink hover:opacity-90 text-foreground"
                        disabled={!newPost.trim()}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Posts */}
            <AnimatePresence>
              {mockPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <GlassCard className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-fused-purple/30 flex items-center justify-center border border-fused-purple/50 flex-shrink-0">
                        <span className="text-fused-purple font-semibold">
                          {post.author_ign[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{post.author_ign}</span>
                          {(post.author_role === 'Staff' || post.author_role === 'Admin') && (
                            <CheckCircle className="w-4 h-4 text-fused-purple" />
                          )}
                          <RankBadge rank={post.author_rank} size="sm" showLabel={false} />
                          {post.is_featured && (
                            <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium flex items-center gap-1">
                              <Star className="w-3 h-3" /> Featured
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={getRoleColor(post.author_role)}>{post.author_role}</span>
                          <span className="text-muted-foreground/50">•</span>
                          <span className="text-muted-foreground">
                            {format(new Date(post.created_date), 'MMM d, h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="whitespace-pre-wrap break-words">
                        {post.content.split(/(#\w+)/g).map((part, i) => 
                          part.startsWith('#') ? (
                            <span key={i} className="text-fused-purple hover:underline cursor-pointer">{part}</span>
                          ) : part
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          likedPosts.has(post.id) ? 'text-fused-pink' : 'text-muted-foreground hover:text-fused-pink'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        <span className="text-sm">
                          {post.likes_count + (likedPosts.has(post.id) ? 1 : 0)}
                        </span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments_count}</span>
                      </button>
                      
                      <button className="flex items-center gap-2 text-muted-foreground hover:text-green-400 transition-colors">
                        <Repeat2 className="w-5 h-5" />
                        <span className="text-sm">{post.reposts_count}</span>
                      </button>
                      
                      <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
                        <Share className="w-5 h-5" />
                      </button>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <GlassCard className="p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-fused-purple" />
                <h3 className="font-semibold">Trending</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((tag) => (
                  <button
                    key={tag}
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
