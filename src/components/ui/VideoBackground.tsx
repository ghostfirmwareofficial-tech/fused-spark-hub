import { useRef, useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VideoBackgroundProps {
  opacity?: number;
  showAudioToggle?: boolean;
}

// Singleton pattern - video element stored in a global variable outside React
let sharedVideoElement: HTMLVideoElement | null = null;
let sharedMuted = true; // Start muted to comply with autoplay policies

function getOrCreateVideo(): HTMLVideoElement {
  if (!sharedVideoElement) {
    sharedVideoElement = document.createElement('video');
    sharedVideoElement.src = '/videos/hero-bg.mp4';
    sharedVideoElement.loop = true;
    sharedVideoElement.playsInline = true;
    sharedVideoElement.muted = sharedMuted;
    sharedVideoElement.autoplay = true;
    sharedVideoElement.className = 'absolute w-full h-full object-cover';
    // Start playing immediately
    sharedVideoElement.play().catch(() => {});
  }
  return sharedVideoElement;
}

export default function VideoBackground({ opacity = 0.3, showAudioToggle = false }: VideoBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(sharedMuted);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Prevent double-mount in StrictMode from creating issues
    if (mountedRef.current) return;
    mountedRef.current = true;

    const video = getOrCreateVideo();
    
    // Only append if not already in this container
    if (containerRef.current && video.parentElement !== containerRef.current) {
      // Remove from previous parent if exists
      if (video.parentElement) {
        video.parentElement.removeChild(video);
      }
      containerRef.current.insertBefore(video, containerRef.current.firstChild);
    }

    // Sync muted state
    setIsMuted(video.muted);

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const toggleMute = () => {
    const video = getOrCreateVideo();
    sharedMuted = !sharedMuted;
    video.muted = sharedMuted;
    setIsMuted(sharedMuted);
    
    // If unmuting, ensure video is playing
    if (!sharedMuted) {
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
