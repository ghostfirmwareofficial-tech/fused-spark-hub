import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface LiquidGlassProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // 0-1 scale for displacement intensity
  blur?: number; // Blur amount in pixels
  as?: 'div' | 'nav' | 'header' | 'section';
}

const LiquidGlass = React.forwardRef<HTMLDivElement, LiquidGlassProps>(
  ({ children, className, intensity = 0.5, blur = 8, as: Component = 'div' }, ref) => {
    const filterId = useRef(`liquid-glass-${Math.random().toString(36).substr(2, 9)}`);
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      // Small delay to ensure filter is applied
      const timer = setTimeout(() => setIsLoaded(true), 50);
      return () => clearTimeout(timer);
    }, []);

    // Scale ranges from 0.2 to 1.2 based on intensity
    const displacementScale = 0.2 + (intensity * 1.0);
    const blurAmount = blur / 100;

    return (
      <>
        {/* SVG Filter Definition */}
        <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
          <defs>
            <filter
              id={filterId.current}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              filterUnits="objectBoundingBox"
              primitiveUnits="objectBoundingBox"
            >
              {/* Create a radial gradient for lens-like displacement */}
              <feImage
                href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cdefs%3E%3CradialGradient id='g' cx='50%25' cy='50%25' r='50%25'%3E%3Cstop offset='0%25' stop-color='%23808080'/%3E%3Cstop offset='30%25' stop-color='%23606060'/%3E%3Cstop offset='60%25' stop-color='%23909090'/%3E%3Cstop offset='100%25' stop-color='%23808080'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect fill='url(%23g)' width='300' height='300'/%3E%3C/svg%3E"
                x="0"
                y="0"
                width="1"
                height="1"
                preserveAspectRatio="none"
                result="dispMap"
              />
              
              {/* Blur the background slightly for frosted effect */}
              <feGaussianBlur in="BackgroundImage" stdDeviation={blurAmount} result="blurred" />
              
              {/* Apply displacement for lens refraction effect */}
              <feDisplacementMap
                in="blurred"
                in2="dispMap"
                scale={displacementScale}
                xChannelSelector="R"
                yChannelSelector="G"
                result="displaced"
              />
              
              {/* Blend with original */}
              <feBlend in="displaced" in2="SourceGraphic" mode="normal" />
            </filter>
          </defs>
        </svg>

        {/* The actual glass element */}
        <div
          ref={ref || containerRef}
          className={cn(
            'relative overflow-hidden transition-all duration-300',
            isLoaded && 'liquid-glass-active',
            className
          )}
          style={{
            backdropFilter: `blur(${blur}px) url(#${filterId.current})`,
            WebkitBackdropFilter: `blur(${blur}px)`,
          }}
        >
          {/* Curved glass edge highlights */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 100% 40% at 50% 0%, rgba(255,255,255,0.15) 0%, transparent 50%),
                radial-gradient(ellipse 80% 30% at 50% 100%, rgba(255,255,255,0.08) 0%, transparent 50%),
                linear-gradient(90deg, rgba(255,255,255,0.05) 0%, transparent 10%, transparent 90%, rgba(255,255,255,0.05) 100%)
              `,
              borderRadius: 'inherit',
            }}
          />
          
          {/* Inner shadow for depth */}
          <div 
            className="absolute inset-0 pointer-events-none rounded-inherit"
            style={{
              boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.1),
                inset 0 -2px 4px rgba(0,0,0,0.2),
                inset 2px 0 4px rgba(255,255,255,0.05),
                inset -2px 0 4px rgba(255,255,255,0.05)
              `,
              borderRadius: 'inherit',
            }}
          />
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </>
    );
  }
);

LiquidGlass.displayName = 'LiquidGlass';

export default LiquidGlass;
