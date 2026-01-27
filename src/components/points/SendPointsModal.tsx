import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Send, Search } from 'lucide-react';
import { usePointTransfer } from '@/hooks/usePointTransfer';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SendPointsModalProps {
  trigger?: React.ReactNode;
  preselectedUser?: { userId: string; ign: string };
}

export function SendPointsModal({ trigger, preselectedUser }: SendPointsModalProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ user_id: string; ign: string; avatar_url: string | null }>>([]);
  const [selectedUser, setSelectedUser] = useState<{ userId: string; ign: string } | null>(preselectedUser || null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const { sendPoints, currentBalance } = usePointTransfer();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const { data } = await supabase
      .from('profiles')
      .select('user_id, ign, avatar_url')
      .ilike('ign', `%${query}%`)
      .limit(5);

    setSearchResults(data || []);
  };

  const handleSelectUser = (user: { user_id: string; ign: string }) => {
    setSelectedUser({ userId: user.user_id, ign: user.ign });
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSend = async () => {
    if (!selectedUser || !amount) return;
    
    const amountNum = parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    await sendPoints.mutateAsync({
      receiverUserId: selectedUser.userId,
      amount: amountNum,
      message: message || undefined,
    });

    setOpen(false);
    setSelectedUser(preselectedUser || null);
    setAmount('');
    setMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <Send className="h-4 w-4" />
            Send FP
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Send Fused Points</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            Your balance: <span className="text-primary font-bold">{currentBalance} FP</span>
          </div>

          {!selectedUser ? (
            <div className="space-y-2">
              <Label>Search User</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="border border-border rounded-md overflow-hidden">
                  {searchResults.map((user) => (
                    <button
                      key={user.user_id}
                      onClick={() => handleSelectUser(user)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>{user.ign[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-foreground">{user.ign}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Sending to</Label>
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                <span className="font-medium text-foreground">{selectedUser.ign}</span>
                {!preselectedUser && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedUser(null)}>
                    Change
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Amount (FP)</Label>
            <Input
              type="number"
              min="1"
              max={currentBalance}
              placeholder="Enter amount..."
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Message (optional)</Label>
            <Textarea
              placeholder="Add a note..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
            />
          </div>

          <Button
            onClick={handleSend}
            disabled={!selectedUser || !amount || sendPoints.isPending || parseInt(amount) > currentBalance}
            className="w-full"
          >
            {sendPoints.isPending ? 'Sending...' : `Send ${amount || '0'} FP`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
