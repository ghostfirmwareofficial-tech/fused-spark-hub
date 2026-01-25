import { useState, forwardRef } from 'react';
import { format } from 'date-fns';
import { 
  Heart, 
  MessageCircle, 
  Repeat2, 
  Share, 
  Star, 
  CheckCircle, 
  Pin,
  Send,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import GlassCard from '@/components/ui/GlassCard';
import RankBadge from '@/components/ui/RankBadge';
import { usePostInteractions } from '@/hooks/usePostInteractions';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';

interface PostProfile {
  ign: string;
  rank: string;
  role: string;
  avatar_url: string | null;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url: string | null;
  video_url: string | null;
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  is_featured: boolean;
  is_pinned?: boolean;
  created_at: string;
  profiles?: PostProfile;
}

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
}

const PostCard = forwardRef<HTMLDivElement, PostCardProps>(({ post, onDelete }, ref) => {
  const { user } = useAuth();
  const { isAdmin, isModerator } = useUserRole();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const {
    hasLiked,
    hasReposted,
    comments,
    likePost,
    unlikePost,
    repost,
    unrepost,
    addComment,
    deleteComment,
    pinPost,
  } = usePostInteractions(post.id);

  const canModerate = isAdmin || isModerator;
  const isOwner = user?.id === post.user_id;

  const handleLikeToggle = () => {
    if (hasLiked) {
      unlikePost.mutate(post.id);
    } else {
      likePost.mutate(post.id);
    }
  };

  const handleRepostToggle = () => {
    if (hasReposted) {
      unrepost.mutate(post.id);
    } else {
      repost.mutate(post.id);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment.mutate({ targetPostId: post.id, content: newComment });
    setNewComment('');
  };

  const handlePinToggle = () => {
    pinPost.mutate({ targetPostId: post.id, pin: !post.is_pinned });
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
    <div ref={ref}>
      <GlassCard className={cn("p-6", post.is_pinned && "ring-2 ring-fused-purple/50")}>
        {/* Pinned indicator */}
        {post.is_pinned && (
          <div className="flex items-center gap-2 text-fused-purple text-sm mb-3 -mt-2">
            <Pin className="w-4 h-4" />
            <span>Pinned post</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fused-purple/30 to-fused-blue/30 flex items-center justify-center border border-white/20 flex-shrink-0">
            {post.profiles?.avatar_url ? (
              <img src={post.profiles.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
            ) : (
              <span className="text-fused-purple font-semibold">{post.profiles?.ign?.[0]}</span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{post.profiles?.ign}</span>
              {post.profiles?.role === 'Admin' && <CheckCircle className="w-4 h-4 text-fused-purple" />}
              <RankBadge rank={post.profiles?.rank || 'Recruit'} size="sm" showLabel={false} />
              {post.is_featured && (
                <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs flex items-center gap-1">
                  <Star className="w-3 h-3" />Featured
                </span>
              )}
            </div>
            <span className={`text-sm ${getRoleColor(post.profiles?.role || 'Member')}`}>
              {post.profiles?.role} • {format(new Date(post.created_at), 'MMM d, h:mm a')}
            </span>
          </div>

          {/* Actions dropdown */}
          {(canModerate || isOwner) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-md border-white/10">
                {canModerate && (
                  <DropdownMenuItem onClick={handlePinToggle}>
                    <Pin className="w-4 h-4 mr-2" />
                    {post.is_pinned ? 'Unpin post' : 'Pin post'}
                  </DropdownMenuItem>
                )}
                {isOwner && (
                  <DropdownMenuItem onClick={() => onDelete?.(post.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete post
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Content */}
        <p className="whitespace-pre-wrap mb-4">{post.content}</p>
        {post.image_url && <img src={post.image_url} className="rounded-xl mb-4 max-h-96 w-full object-cover" alt="" />}
        {post.video_url && <video src={post.video_url} controls className="rounded-xl mb-4 max-h-96 w-full" />}

        {/* Actions */}
        <div className="flex items-center gap-6 pt-4 border-t border-white/5">
          <button 
            onClick={handleLikeToggle} 
            className={cn(
              "flex items-center gap-2 transition-colors",
              hasLiked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'
            )}
          >
            <Heart className={cn("w-5 h-5", hasLiked && "fill-current")} />
            <span className="text-sm">{post.likes_count}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)} 
            className="flex items-center gap-2 text-muted-foreground hover:text-fused-blue transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments_count}</span>
          </button>
          
          <button 
            onClick={handleRepostToggle}
            className={cn(
              "flex items-center gap-2 transition-colors",
              hasReposted ? 'text-green-400' : 'text-muted-foreground hover:text-green-400'
            )}
          >
            <Repeat2 className={cn("w-5 h-5", hasReposted && "text-green-400")} />
            <span className="text-sm">{post.reposts_count}</span>
          </button>
          
          <button className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
            <Share className="w-5 h-5" />
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2 items-start">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-fused-purple/20 to-fused-blue/20 flex items-center justify-center flex-shrink-0">
                  {comment.profiles?.avatar_url ? (
                    <img src={comment.profiles.avatar_url} className="w-full h-full rounded-full object-cover" alt="" />
                  ) : (
                    <span className="text-xs text-fused-purple">{comment.profiles?.ign?.[0]}</span>
                  )}
                </div>
                <div className="flex-1 bg-white/5 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium">{comment.profiles?.ign}</span>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
                {user?.id === comment.user_id && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteComment.mutate({ commentId: comment.id, targetPostId: post.id })}
                  >
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                )}
              </div>
            ))}

            {user && (
              <div className="flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  className="bg-white/5 border-white/10"
                />
                <Button onClick={handleAddComment} size="sm" disabled={!newComment.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
