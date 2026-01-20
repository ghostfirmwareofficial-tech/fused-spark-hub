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
import GlassCard from '@/components/ui/GlassCard';
import RankBadge from '@/components/ui/RankBadge';
import VideoBackground from '@/components/ui/VideoBackground';
import { cn } from '@/lib/utils';

type Channel = 'general' | 'competitive' | 'content' | 'off-topic';

interface ChatMessage {
  id: string;
  channel: Channel;
  author_ign: string;
  author_rank: string;
  author_role: string;
  content: string;
  created_date: string;
}

const channels = [
  { id: 'general' as const, name: 'general', icon: Hash, description: 'General chat for everyone' },
  { id: 'competitive' as const, name: 'competitive', icon: Trophy, description: 'For competitive players' },
  { id: 'content' as const, name: 'content', icon: Video, description: 'Content creators hub' },
  { id: 'off-topic' as const, name: 'off-topic', icon: MessageSquare, description: 'Anything goes!' },
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    channel: 'general',
    author_ign: 'FusedUp Bot',
    author_rank: 'Ascended',
    author_role: 'Admin',
    content: 'Welcome to the Fused Up chat! Be respectful and have fun 🎮',
    created_date: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '2',
    channel: 'general',
    author_ign: 'ProGamer123',
    author_rank: 'Challenger',
    author_role: 'Competitive',
    content: 'Anyone down for some arena duos?',
    created_date: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: '3',
    channel: 'general',
    author_ign: 'StreamerKid',
    author_rank: 'Grinder',
    author_role: 'Creator',
    content: 'Just hit a crazy clip, gonna post it on the feed later!',
    created_date: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: '4',
    channel: 'general',
    author_ign: 'NewMember',
    author_rank: 'Recruit',
    author_role: 'Member',
    content: 'Hey everyone! Just joined, excited to be here 🙌',
    created_date: new Date(Date.now() - 300000).toISOString(),
  },
];

export default function Chat() {
  const [activeChannel, setActiveChannel] = useState<Channel>('general');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredMessages = messages.filter(m => m.channel === activeChannel);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [filteredMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      channel: activeChannel,
      author_ign: 'You',
      author_rank: 'Recruit',
      author_role: 'Member',
      content: newMessage,
      created_date: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
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
      <VideoBackground opacity={0.15} />
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-2">
            Community <span className="gradient-text">Chat</span>
          </h1>
          <p className="text-muted-foreground">
            Connect with other members in real-time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6 h-[calc(100vh-220px)]">
          {/* Channels Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-4 h-full">
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
                <a 
                  href="https://discord.gg/fusedupesports" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" className="w-full border-[#5865F2] text-[#5865F2] hover:bg-[#5865F2]/10">
                    Join Discord
                  </Button>
                </a>
              </div>
            </GlassCard>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="h-full flex flex-col">
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
                {filteredMessages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-fused-purple/30 flex items-center justify-center border border-fused-purple/50 flex-shrink-0">
                      <span className="text-fused-purple font-semibold text-sm">
                        {message.author_ign[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{message.author_ign}</span>
                        <RankBadge rank={message.author_rank} size="sm" showLabel={false} />
                        <span className={cn("text-xs", getRoleColor(message.author_role))}>
                          {message.author_role}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(message.created_date), 'h:mm a')}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
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
                    className="bg-gradient-to-r from-fused-purple to-fused-pink hover:opacity-90 text-foreground"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
