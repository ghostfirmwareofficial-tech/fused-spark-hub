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
import { Loader2, Info } from 'lucide-react';

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
    description: 'Link your Epic Games username to show your Fortnite stats on your profile.',
    inputLabel: 'Epic Games Username',
    helpText: 'Make sure your Fortnite stats are set to public in your Epic Games privacy settings.',
  },
  steam: {
    name: 'Steam',
    placeholder: 'Enter your Steam username or profile URL',
    description: 'Link your Steam account to display your gaming library.',
    inputLabel: 'Steam Username or Profile URL',
    helpText: null,
  },
  riot: {
    name: 'Riot Games',
    placeholder: 'Username#TAG (e.g., Player#NA1)',
    description: 'Link your Riot ID to show your Valorant/LoL stats.',
    inputLabel: 'Riot ID',
    helpText: null,
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
                maxLength={50}
              />
            </div>
            {config.helpText && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{config.helpText}</p>
              </div>
            )}
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
