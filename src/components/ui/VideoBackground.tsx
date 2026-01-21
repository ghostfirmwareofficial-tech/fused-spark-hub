import { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoBackgroundProps {
  opacity?: number;
  showAudioToggle?: boolean;
}

// Singleton pattern - ensure only ONE video element exists globally
let sharedVideoElement: HTMLVideoElement | null = null;
let sharedMuted = false; // Start unmuted - user can mute if needed
let videoInitialized = false;

function getOrCreateVideo(): HTMLVideoElement {
  if (!sharedVideoElement) {
    sharedVideoElement = document.createElement('video');
    sharedVideoElement.src = '/videos/hero-bg.mp4';
    sharedVideoElement.loop = true;
    sharedVideoElement.playsInline = true;
    sharedVideoElement.muted = sharedMuted;
    sharedVideoElement.autoplay = true;
    sharedVideoElement.className = 'absolute w-full h-full object-cover';
  }
  return sharedVideoElement;
}

export default function VideoBackground({ opacity = 0.3, showAudioToggle = false }: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(sharedMuted);

  useEffect(() => {
    // Guard against multiple initializations
    if (videoInitialized) {
      const video = getOrCreateVideo();
      // Just move the existing video to this container
      if (containerRef.current && video.parentElement !== containerRef.current) {
        containerRef.current.insertBefore(video, containerRef.current.firstChild);
      }
      setIsMuted(video.muted);
      return;
    }

    videoInitialized = true;
    const video = getOrCreateVideo();
    
    if (containerRef.current) {
      containerRef.current.insertBefore(video, containerRef.current.firstChild);
      
      // Try to play with audio - browsers may block this
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay with audio blocked, try muted
          video.muted = true;
          sharedMuted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });
      }
    }

    setIsMuted(video.muted);

    return () => {
      // Don't destroy on unmount - keep playing
    };
  }, []);

  const toggleMute = () => {
    const video = getOrCreateVideo();
    sharedMuted = !sharedMuted;
    video.muted = sharedMuted;
    setIsMuted(sharedMuted);
    
    // Ensure video is playing
    video.play().catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div ref={containerRef} className="absolute inset-0" />
      {/* Enhanced gradient overlay for depth */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/90" 
        style={{ opacity: 1 - opacity + 0.2 }}
      />
      {/* Radial vignette for cinematic effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_70%)] opacity-60" />
      
      {showAudioToggle && (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full glass hover:bg-white/10 transition-all duration-300 pointer-events-auto hover:scale-110 active:scale-95"
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
