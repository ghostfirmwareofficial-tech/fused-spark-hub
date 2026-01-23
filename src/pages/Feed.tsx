import { useState, useRef } from 'react';
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
  TrendingUp,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import GlassCard from '@/components/ui/GlassCard';
import RankBadge from '@/components/ui/RankBadge';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';

const trendingHashtags = ['#Fortnite', '#FusedUp', '#Highlights', '#Competitive', '#Victory'];

export default function Feed() {
  const { user } = useAuth();
  const { posts, isLoading, createPost, toggleLike } = usePosts();
  const [newPost, setNewPost] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleLike = (postId: string) => {
    if (!likedPosts.has(postId)) {
      toggleLike.mutate(postId);
      setLikedPosts(prev => new Set(prev).add(postId));
    }
  };

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
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Staff': 'text-destructive',
      'Admin': 'text-destructive',
      'Competitive': 'text-fused-blue',
      'Creator': 'text-fused-purple',
      'Member': 'text-muted-foreground'
    };
    return colors[role] || 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community <span className="gradient-text">Feed</span></h1>
          <p className="text-muted-foreground">Share highlights and connect</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-6">
            {/* Create Post */}
            {user && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
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

            {/* Posts */}
            {isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-fused-purple" /></div>
            ) : (
              <AnimatePresence>
                {posts.map((post, index) => (
                  <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <GlassCard className="p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fused-purple/30 to-fused-blue/30 flex items-center justify-center border border-white/20 flex-shrink-0">
                          {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} className="w-full h-full rounded-full object-cover" /> : <span className="text-fused-purple font-semibold">{post.profiles?.ign?.[0]}</span>}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{post.profiles?.ign}</span>
                            {post.profiles?.role === 'Admin' && <CheckCircle className="w-4 h-4 text-fused-purple" />}
                            <RankBadge rank={post.profiles?.rank || 'Recruit'} size="sm" showLabel={false} />
                            {post.is_featured && <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center gap-1"><Star className="w-3 h-3" />Featured</span>}
                          </div>
                          <span className={`text-sm ${getRoleColor(post.profiles?.role || 'Member')}`}>{post.profiles?.role} • {format(new Date(post.created_at), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                      <p className="whitespace-pre-wrap mb-4">{post.content}</p>
                      {post.image_url && <img src={post.image_url} className="rounded-xl mb-4 max-h-96 w-full object-cover" />}
                      {post.video_url && <video src={post.video_url} controls className="rounded-xl mb-4 max-h-96 w-full" />}
                      <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                        <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 ${likedPosts.has(post.id) ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}>
                          <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          <span className="text-sm">{post.likes_count + (likedPosts.has(post.id) ? 1 : 0)}</span>
                        </button>
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-fused-blue"><MessageCircle className="w-5 h-5" /><span className="text-sm">{post.comments_count}</span></button>
                        <button className="flex items-center gap-2 text-muted-foreground hover:text-green-400"><Repeat2 className="w-5 h-5" /><span className="text-sm">{post.reposts_count}</span></button>
                        <button className="ml-auto text-muted-foreground hover:text-foreground"><Share className="w-5 h-5" /></button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block">
            <GlassCard className="p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4"><TrendingUp className="w-5 h-5 text-fused-purple" /><h3 className="font-semibold">Trending</h3></div>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map((tag) => <button key={tag} className="px-3 py-1.5 rounded-full bg-fused-purple/10 text-fused-purple text-sm hover:bg-fused-purple/20">{tag}</button>)}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
