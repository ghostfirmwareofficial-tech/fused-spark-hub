import { ReactNode } from 'react';
import Navbar from './Navbar';
import VideoBackground from '@/components/ui/VideoBackground';
import FloatingParticles from '@/components/ui/FloatingParticles';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <VideoBackground opacity={0.3} showAudioToggle={true} />
      <FloatingParticles />
      {/* Ambient glow orbs for depth */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-fused-purple/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-fused-pink/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fused-purple/10 rounded-full blur-[200px] pointer-events-none" />
      <Navbar />
      <main className="pt-24 min-h-screen relative z-10">
        {children}
      </main>
    </div>
  );
}
