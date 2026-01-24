import { ReactNode } from 'react';
import Navbar from './Navbar';
import LeftSidebar from './LeftSidebar';
import VideoBackground from '@/components/ui/VideoBackground';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <VideoBackground opacity={0.2} showAudioToggle={true} />
      
      {/* Left Sidebar - Desktop only */}
      <LeftSidebar />
      
      {/* Main Content Area */}
      <div className="lg:pl-24">
        <Navbar />
        <main className="min-h-screen relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}