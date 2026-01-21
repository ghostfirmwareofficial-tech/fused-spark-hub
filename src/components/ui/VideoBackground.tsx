import { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoBackgroundProps {
  opacity?: number;
  showAudioToggle?: boolean;
}

// Create a singleton video element that persists across route changes
let sharedVideoElement: HTMLVideoElement | null = null;
let sharedCurrentTime = 0;

function getSharedVideo(): HTMLVideoElement {
  if (!sharedVideoElement) {
    sharedVideoElement = document.createElement('video');
    sharedVideoElement.src = '/videos/hero-bg.mp4';
    sharedVideoElement.loop = true;
    sharedVideoElement.playsInline = true;
    sharedVideoElement.muted = true;
    sharedVideoElement.autoplay = true;
    sharedVideoElement.className = 'absolute w-full h-full object-cover';
  }
  return sharedVideoElement;
}

export default function VideoBackground({ opacity = 0.3, showAudioToggle = false }: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = getSharedVideo();
    
    if (containerRef.current && !containerRef.current.contains(video)) {
      // Restore the current time from when we left
      if (sharedCurrentTime > 0) {
        video.currentTime = sharedCurrentTime;
      }
      containerRef.current.insertBefore(video, containerRef.current.firstChild);
      video.play().catch(() => {});
    }

    // Save current time periodically
    const interval = setInterval(() => {
      if (video) {
        sharedCurrentTime = video.currentTime;
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (video) {
        sharedCurrentTime = video.currentTime;
      }
    };
  }, []);

  const toggleMute = () => {
    const video = getSharedVideo();
    video.muted = !video.muted;
    setIsMuted(video.muted);
    // Ensure video is playing when unmuting
    if (!video.muted) {
      video.play().catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div ref={containerRef} className="absolute inset-0" />
      <div 
        className="absolute inset-0 bg-background" 
        style={{ opacity: 1 - opacity }}
      />
      
      {showAudioToggle && (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full glass hover:bg-white/10 transition-colors pointer-events-auto"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-foreground" />
          ) : (
            <Volume2 className="w-5 h-5 text-foreground" />
          )}
        </button>
      )}
    </div>
  );
}
