import React, { useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface BubbleCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export default function BubbleCard({ 
  children, 
  className, 
  glow = false,
  ...props 
}: BubbleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        'bubble-effect glass-card transition-all duration-300',
        'hover:border-fused-purple/40 hover:shadow-lg hover:shadow-fused-purple/10',
        glow && 'glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
