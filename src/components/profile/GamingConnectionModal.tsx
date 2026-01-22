import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface GamingConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'epic' | 'steam' | 'riot';
  onConnect: (username: string) => Promise<boolean>;
  isLoading?: boolean;
}

const platformConfig = {
  epic: {
    name: 'Epic Games',
    placeholder: 'Enter your Epic Games username',
    description: 'Link your Epic Games account to show your Fortnite stats.',
    inputLabel: 'Epic Games Username',
  },
  steam: {
    name: 'Steam',
    placeholder: 'Enter your Steam username or profile URL',
    description: 'Link your Steam account to display your gaming library.',
    inputLabel: 'Steam Username or Profile URL',
  },
  riot: {
    name: 'Riot Games',
    placeholder: 'Username#TAG (e.g., Player#NA1)',
    description: 'Link your Riot ID to show your Valorant/LoL stats.',
    inputLabel: 'Riot ID',
  },
};

export default function GamingConnectionModal({
  isOpen,
  onClose,
  platform,
  onConnect,
  isLoading,
}: GamingConnectionModalProps) {
  const [username, setUsername] = useState('');
  const config = platformConfig[platform];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    const success = await onConnect(username.trim());
    if (success) {
      setUsername('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass border-fused-purple/20">
        <DialogHeader>
          <DialogTitle>Connect {config.name}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="username">{config.inputLabel}</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={config.placeholder}
                className="bg-white/5"
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!username.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
