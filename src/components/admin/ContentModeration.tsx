import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  MessageSquare, 
  FileText, 
  Trash2, 
  Search,
  Loader2,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useModeration } from '@/hooks/useModeration';
import BubbleCard from '@/components/ui/BubbleCard';
import RankBadge from '@/components/ui/RankBadge';

export default function ContentModeration() {
  const { 
    allMessages, 
    messagesLoading, 
    allPosts, 
    postsLoading,
    deleteMessage,
    deletePost,
  } = useModeration();
  
  const [messageSearch, setMessageSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');

  const filteredMessages = allMessages.filter(msg => 
    msg.content?.toLowerCase().includes(messageSearch.toLowerCase()) ||
    msg.profile?.ign?.toLowerCase().includes(messageSearch.toLowerCase())
  );

  const filteredPosts = allPosts.filter(post => 
    post.content?.toLowerCase().includes(postSearch.toLowerCase()) ||
    post.profile?.ign?.toLowerCase().includes(postSearch.toLowerCase())
  );

  return (
    <BubbleCard className="p-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Filter className="w-5 h-5 text-fused-purple" />
        Content Moderation
      </h2>

      <Tabs defaultValue="messages">
        <TabsList className="bg-white/5 border border-white/10 mb-4">
          <TabsTrigger value="messages" className="data-[state=active]:bg-fused-purple/20">
            <MessageSquare className="w-4 h-4 mr-2" />
            Messages ({allMessages.length})
          </TabsTrigger>
          <TabsTrigger value="posts" className="data-[state=active]:bg-fused-purple/20">
            <FileText className="w-4 h-4 mr-2" />
            Posts ({allPosts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={messageSearch}
                onChange={(e) => setMessageSearch(e.target.value)}
                placeholder="Search messages..."
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>

            {messagesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-fused-purple" />
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-start justify-between p-3 rounded-lg bg-white/5 border border-white/10 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.profile?.ign || 'Unknown'}</span>
                        <RankBadge rank={msg.profile?.rank || 'Recruit'} size="sm" showLabel={false} />
                        <span className="text-xs text-muted-foreground">
                          #{msg.channel} • {format(new Date(msg.created_at), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{msg.content}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteMessage.mutate(msg.id)}
                      disabled={deleteMessage.isPending}
                      className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="posts">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                placeholder="Search posts..."
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>

            {postsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-fused-purple" />
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-start justify-between p-3 rounded-lg bg-white/5 border border-white/10 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{post.profile?.ign || 'Unknown'}</span>
                        <RankBadge rank={post.profile?.rank || 'Recruit'} size="sm" showLabel={false} />
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(post.created_at), 'MMM d, h:mm a')}
                        </span>
                        {post.image_url && <span className="text-xs text-fused-blue">📷</span>}
                        {post.video_url && <span className="text-xs text-fused-purple">🎥</span>}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePost.mutate(post.id)}
                      disabled={deletePost.isPending}
                      className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </BubbleCard>
  );
}
