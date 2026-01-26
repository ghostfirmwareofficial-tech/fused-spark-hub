import { useState, useEffect } from 'react';
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
import { Loader2, ExternalLink } from 'lucide-react';
import { useGamingAccounts } from '@/hooks/useGamingAccounts';

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
    useOAuth: true,
  },
  steam: {
    name: 'Steam',
    placeholder: 'Enter your Steam username or profile URL',
    description: 'Link your Steam account to display your gaming library.',
    inputLabel: 'Steam Username or Profile URL',
    useOAuth: false,
  },
  riot: {
    name: 'Riot Games',
    placeholder: 'Username#TAG (e.g., Player#NA1)',
    description: 'Link your Riot ID to show your Valorant/LoL stats.',
    inputLabel: 'Riot ID',
    useOAuth: false,
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
  const { connectEpicGames, isConnecting } = useGamingAccounts();

  // Close modal when Epic OAuth completes
  useEffect(() => {
    if (platform === 'epic' && !isConnecting && isOpen) {
      // Modal stays open during OAuth, closes after success/failure via parent
    }
  }, [isConnecting, platform, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    const success = await onConnect(username.trim());
    if (success) {
      setUsername('');
      onClose();
    }
  };

  const handleEpicOAuth = async () => {
    await connectEpicGames();
    // Modal will close via parent component after OAuth completes
    onClose();
  };

  const epicLoading = isConnecting === 'epic';

  // For Epic Games, show OAuth button instead of input
  if (platform === 'epic' && config.useOAuth) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md glass border-fused-purple/20">
          <DialogHeader>
            <DialogTitle>Connect {config.name}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <p className="text-sm text-muted-foreground mb-4">
              Sign in with your Epic Games account to automatically link it and display your Fortnite stats.
            </p>
            <Button 
              onClick={handleEpicOAuth} 
              disabled={epicLoading}
              className="w-full bg-[#313131] hover:bg-[#414141] text-white"
            >
              {epicLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Sign in with Epic Games
                </>
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={epicLoading}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // For other platforms, use manual input
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
