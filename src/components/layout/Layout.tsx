import { ReactNode } from 'react';
import Navbar from './Navbar';
import VideoBackground from '@/components/ui/VideoBackground';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <VideoBackground opacity={0.3} showAudioToggle={true} />
      <Navbar />
      <main className="pt-24 min-h-screen relative z-10">
        {children}
      </main>
    </div>
  );
}
