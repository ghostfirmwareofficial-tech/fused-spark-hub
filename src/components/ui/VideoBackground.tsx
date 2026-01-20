import React from 'react';

interface VideoBackgroundProps {
  opacity?: number;
}

export default function VideoBackground({ opacity = 0.3 }: VideoBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute w-full h-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>
      <div 
        className="absolute inset-0 bg-background" 
        style={{ opacity: 1 - opacity }}
      />
    </div>
  );
}
