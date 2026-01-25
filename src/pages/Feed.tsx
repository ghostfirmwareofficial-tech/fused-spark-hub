import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
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
import PostCard from '@/components/feed/PostCard';
import TeamUpSection from '@/components/feed/TeamUpSection';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';

const trendingHashtags = ['#Fortnite', '#FusedUp', '#Highlights', '#Competitive', '#Victory'];

export default function Feed() {
  const { user } = useAuth();
  const { posts, isLoading, createPost, deletePost } = usePosts();
  const [newPost, setNewPost] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
  };

  const handleDeletePost = (postId: string) => {
    deletePost.mutate(postId);
  };

  // Sort posts: pinned first, then by date
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community <span className="gradient-text">Feed</span></h1>
          <p className="text-muted-foreground">Share highlights and connect</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
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
                {sortedPosts.map((post, index) => (
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
                {trendingHashtags.map((tag) => <button key={tag} className="px-3 py-1.5 rounded-full bg-fused-purple/10 text-fused-purple text-sm hover:bg-fused-purple/20 transition-colors">{tag}</button>)}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
