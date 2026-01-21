import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  width?: number;
  height?: number;
  variant?: 'default' | 'secondary' | 'accent';
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({
    children,
    onClick,
    className,
    width = 350,
    height = 180,
    variant = 'default',
  }, ref) => {
    const feImageRef = useRef<SVGImageElement>(null);

    useEffect(() => {
      const fetchAndSetMapImage = async () => {
        try {
          const response = await fetch('https://essykings.github.io/JavaScript/map.png');
          const blob = await response.blob();
          const objURL = URL.createObjectURL(blob);
          
          if (feImageRef.current) {
            feImageRef.current.setAttribute('href', objURL);
          }
        } catch (error) {
          console.error('Error loading glass effect map:', error);
        }
      };

      fetchAndSetMapImage();
    }, []);

    const getVariantStyles = () => {
      switch (variant) {
        case 'secondary':
          return 'from-blue-400/20 to-cyan-600/20 border-blue-400/40';
        case 'accent':
          return 'from-fused-pink/20 to-fused-purple/20 border-fused-pink/40';
        default:
          return 'from-white/20 to-white/8 border-white/30';
      }
    };

    return (
      <>
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter
            id="glass"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            primitiveUnits="objectBoundingBox"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.02" result="blur" />
            <feDisplacementMap
              id="disp"
              in="blur"
              in2="map"
              scale="0.8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
            <feImage
              ref={feImageRef}
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
              result="map"
            />
          </filter>
        </svg>

        <button
          ref={ref}
          onClick={onClick}
          className={cn(
            'relative cursor-pointer outline-none rounded-full',
            'border-[1px] backdrop-blur-md',
            'bg-gradient-to-br transition-all duration-300',
            'hover:scale-105 active:scale-95',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50',
            getVariantStyles(),
            className,
          )}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            filter: 'url(#glass)',
            background: `linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.03) 100%)`,
          }}
        >
          <span
            className={cn(
              'font-orbitron font-bold text-white text-center',
              'text-shadow-sm uppercase tracking-widest',
              'drop-shadow-lg',
            )}
            style={{
              fontSize: `calc(${height}px * 0.3)`,
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            {children}
          </span>
        </button>
      </>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export default GlassButton;
