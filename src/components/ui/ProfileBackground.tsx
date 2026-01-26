import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProfileBackgroundProps {
  backgroundId: string | null;
  className?: string;
  children?: React.ReactNode;
}

export default function ProfileBackground({ backgroundId, className, children }: ProfileBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background Layer */}
      <div className="absolute inset-0">
        {backgroundId === 'bg_galaxy' && <GalaxyBackground />}
        {backgroundId === 'bg_fused_lightning' && <FusedLightningBackground />}
        {backgroundId === 'bg_elite_glow' && <EliteGlowBackground />}
        {!backgroundId && <DefaultBackground />}
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

function DefaultBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-fused-purple/10" />
  );
}

function GalaxyBackground() {
  return (
    <div className="absolute inset-0 bg-galaxy-animated">
      {/* Deep space gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2e] to-[#0d1a2d]" />
      
      {/* Nebula layers */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 20% 30%, rgba(139,92,246,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 70%, rgba(139,92,246,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.3) 0%, transparent 50%)',
            'radial-gradient(ellipse at 20% 30%, rgba(139,92,246,0.3) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 70% 20%, rgba(236,72,153,0.2) 0%, transparent 40%)',
            'radial-gradient(ellipse at 30% 80%, rgba(236,72,153,0.2) 0%, transparent 40%)',
            'radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.2) 0%, transparent 40%)',
            'radial-gradient(ellipse at 70% 20%, rgba(236,72,153,0.2) 0%, transparent 40%)',
          ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-20 h-0.5 bg-gradient-to-r from-white to-transparent"
          style={{
            left: '-10%',
            top: `${20 + i * 30}%`,
          }}
          animate={{
            x: ['0vw', '120vw'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 4 + 2,
            repeatDelay: 8,
          }}
        />
      ))}
    </div>
  );
}

function FusedLightningBackground() {
  return (
    <div className="absolute inset-0 bg-fused-lightning-animated">
      {/* Deep purple base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#2d0a4e] to-[#1a0a2d]" />
      
      {/* Electric pulse overlay */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(139,92,246,0.4) 0%, transparent 70%)',
        }}
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Lightning bolts */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${15 + i * 20}%`,
            top: 0,
            width: '2px',
            height: '100%',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0, 1, 0.8, 0, 0],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            delay: i * 1.5 + Math.random() * 2,
            repeatDelay: 3 + Math.random() * 4,
          }}
        >
          <svg viewBox="0 0 10 100" className="w-full h-full" preserveAspectRatio="none">
            <motion.path
              d="M5,0 L3,30 L8,35 L2,65 L7,70 L4,100"
              fill="none"
              stroke="url(#lightning-gradient)"
              strokeWidth="3"
              filter="url(#glow)"
            />
            <defs>
              <linearGradient id="lightning-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>
        </motion.div>
      ))}
      
      {/* Energy particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)',
            left: `${Math.random() * 100}%`,
            bottom: '-5%',
          }}
          animate={{
            y: [0, -400 - Math.random() * 200],
            opacity: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

function EliteGlowBackground() {
  return (
    <div className="absolute inset-0 bg-elite-glow-animated">
      {/* Pure white/gold base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0f0f14]" />
      
      {/* Golden glow center */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.15) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 50%, rgba(255,215,0,0.15) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      {/* Ethereal white streams */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{
          background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Floating light orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 100 + Math.random() * 100,
            height: 100 + Math.random() * 100,
            background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,215,0,0.08)'} 0%, transparent 70%)`,
            left: `${Math.random() * 80}%`,
            top: `${Math.random() * 80}%`,
          }}
          animate={{
            x: [0, 30, 0, -30, 0],
            y: [0, -20, 0, 20, 0],
            scale: [1, 1.2, 1, 0.9, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}
      
      {/* Golden sparkles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: Math.random() * 4,
          }}
        >
          <div className="w-1 h-1 bg-yellow-300 rounded-full shadow-[0_0_6px_2px_rgba(255,215,0,0.6)]" />
        </motion.div>
      ))}
      
      {/* Lens flare effect */}
      <motion.div
        className="absolute w-32 h-32"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 50%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  );
}

// Preview component for shop
export function BackgroundPreview({ backgroundId, className }: { backgroundId: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)}>
      {backgroundId === 'bg_galaxy' && <GalaxyBackground />}
      {backgroundId === 'bg_fused_lightning' && <FusedLightningBackground />}
      {backgroundId === 'bg_elite_glow' && <EliteGlowBackground />}
    </div>
  );
}
