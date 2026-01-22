import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Send,
  Hash,
  Users,
  Trophy,
  Video,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BubbleCard from '@/components/ui/BubbleCard';
import RankBadge from '@/components/ui/RankBadge';
import CommunityStats from '@/components/ui/CommunityStats';
import { useChatMessages, type Channel } from '@/hooks/useChatMessages';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { cn } from '@/lib/utils';

const channels = [
  { id: 'general' as const, name: 'general', icon: Hash, description: 'General chat for everyone' },
  { id: 'competitive' as const, name: 'competitive', icon: Trophy, description: 'For competitive players' },
  { id: 'content' as const, name: 'content', icon: Video, description: 'Content creators hub' },
  { id: 'off-topic' as const, name: 'off-topic', icon: MessageSquare, description: 'Anything goes!' },
];

export default function Chat() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const [activeChannel, setActiveChannel] = useState<Channel>('general');
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, sendMessage } = useChatMessages(activeChannel);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    sendMessage.mutate(newMessage);
    setNewMessage('');
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'Staff': 'text-red-400',
      'Admin': 'text-red-400',
      'Competitive': 'text-blue-400',
      'Creator': 'text-fused-purple',
      'Member': 'text-muted-foreground'
    };
    return colors[role] || 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Community <span className="gradient-text">Chat</span>
            </h1>
            <p className="text-muted-foreground">
              Connect with other members in real-time
            </p>
          </div>
          <CommunityStats />
        </motion.div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6 h-[calc(100vh-220px)]">
          {/* Channels Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BubbleCard className="p-4 h-full">
              <div className="flex items-center gap-2 mb-4 px-2">
                <Users className="w-5 h-5 text-fused-purple" />
                <span className="font-semibold">Channels</span>
              </div>
              <div className="space-y-1">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left",
                      activeChannel === channel.id
                        ? "bg-fused-purple/20 text-fused-purple"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <channel.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{channel.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <CommunityStats compact className="justify-center" />
              </div>
            </BubbleCard>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <BubbleCard className="h-full flex flex-col">
              {/* Channel Header */}
              <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">{activeChannel}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {channels.find(c => c.id === activeChannel)?.description}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin w-8 h-8 border-2 border-fused-purple border-t-transparent rounded-full" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                    <p>No messages yet. Be the first to say something!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-fused-purple/30 flex items-center justify-center border border-fused-purple/50 flex-shrink-0 overflow-hidden">
                        {message.profiles?.avatar_url ? (
                          <img 
                            src={message.profiles.avatar_url} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-fused-purple font-semibold text-sm">
                            {message.profiles?.ign?.[0] || '?'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold">{message.profiles?.ign || 'Unknown'}</span>
                          <RankBadge rank={message.profiles?.rank || 'Recruit'} size="sm" showLabel={false} />
                          <span className={cn("text-xs", getRoleColor(message.profiles?.role || 'Member'))}>
                            {message.profiles?.role}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(message.created_at), 'h:mm a')}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {user ? (
                <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                  <div className="flex gap-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={`Message #${activeChannel}`}
                      className="bg-white/5 border-white/10 flex-1"
                    />
                    <Button 
                      type="submit"
                      className="bg-gradient-to-r from-fused-blue to-fused-purple hover:opacity-90 text-foreground"
                      disabled={!newMessage.trim() || sendMessage.isPending}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="p-4 border-t border-white/10 text-center text-muted-foreground">
                  Sign in to send messages
                </div>
              )}
            </BubbleCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
