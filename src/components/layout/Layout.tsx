import { ReactNode } from 'react';
import Navbar from './Navbar';
import VideoBackground from '@/components/ui/VideoBackground';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <VideoBackground opacity={0.25} showAudioToggle={false} />
      <Navbar />
      <main className="pt-24 min-h-screen relative z-10">
        {children}
      </main>
    </div>
  );
}
