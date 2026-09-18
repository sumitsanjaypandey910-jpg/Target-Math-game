import React from 'react';
import { motion } from 'motion/react';
import { BubbleItem, BubbleColorTheme } from '../types';

interface BubbleProps {
  bubble: BubbleItem;
  isSelected: boolean;
  currentTime?: number;
  onClick: (bubble: BubbleItem) => void;
}

// Color theme gradients and specular styling matching screenshot
const THEME_STYLES: Record<BubbleColorTheme, {
  outerGlow: string;
  bgGradient: string;
  borderTone: string;
  numberColor: string;
  numberStroke: string;
  innerSpecks: string;
}> = {
  purple: {
    outerGlow: 'rgba(168, 85, 247, 0.5)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #a855f7 0%, #6b21a8 50%, #2e1065 95%)',
    borderTone: '#d8b4fe',
    numberColor: '#ffffff',
    numberStroke: '#2e1065',
    innerSpecks: 'rgba(233, 213, 255, 0.45)',
  },
  gold: {
    outerGlow: 'rgba(245, 158, 11, 0.55)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #fef08a 0%, #f59e0b 50%, #b45309 95%)',
    borderTone: '#fde047',
    numberColor: '#ffffff',
    numberStroke: '#78350f',
    innerSpecks: 'rgba(254, 240, 138, 0.5)',
  },
  green: {
    outerGlow: 'rgba(74, 222, 128, 0.55)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #86efac 0%, #22c55e 50%, #14532d 95%)',
    borderTone: '#bbf7d0',
    numberColor: '#ffffff',
    numberStroke: '#052e16',
    innerSpecks: 'rgba(187, 247, 208, 0.45)',
  },
  magenta: {
    outerGlow: 'rgba(236, 72, 153, 0.55)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #f472b6 0%, #db2777 50%, #831843 95%)',
    borderTone: '#fbcfe8',
    numberColor: '#ffffff',
    numberStroke: '#500724',
    innerSpecks: 'rgba(251, 207, 232, 0.5)',
  },
  pink: {
    outerGlow: 'rgba(244, 114, 182, 0.5)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #fbcfe8 0%, #ec4899 50%, #9d174d 95%)',
    borderTone: '#fce7f3',
    numberColor: '#ffffff',
    numberStroke: '#700735',
    innerSpecks: 'rgba(253, 226, 236, 0.5)',
  },
  sapphire: {
    outerGlow: 'rgba(56, 189, 248, 0.55)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #7dd3fc 0%, #0284c7 50%, #082f49 95%)',
    borderTone: '#bae6fd',
    numberColor: '#ffffff',
    numberStroke: '#082f49',
    innerSpecks: 'rgba(186, 230, 253, 0.45)',
  },
  coral: {
    outerGlow: 'rgba(251, 113, 133, 0.55)',
    bgGradient: 'radial-gradient(circle at 35% 30%, #fda4af 0%, #f43f5e 50%, #881337 95%)',
    borderTone: '#fecdd3',
    numberColor: '#ffffff',
    numberStroke: '#4c0519',
    innerSpecks: 'rgba(254, 205, 211, 0.5)',
  },
};

export const Bubble: React.FC<BubbleProps> = ({
  bubble,
  isSelected,
  onClick,
}) => {
  const theme = THEME_STYLES[bubble.colorTheme] || THEME_STYLES.purple;
  const size = bubble.radius * 2;

  return (
    <motion.div
      className="absolute cursor-pointer select-none touch-manipulation z-30"
      style={{
        left: `${bubble.x}%`,
        top: `${bubble.y}%`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={
        bubble.popping
          ? {
              scale: [1, 1.35, 0],
              opacity: [1, 0.9, 0],
              transition: { duration: 0.28, ease: 'easeOut' },
            }
          : bubble.shaking
          ? {
              x: [0, -9, 9, -7, 7, -3, 3, 0],
              scale: 1.05,
              transition: { duration: 0.4, ease: 'easeInOut' },
            }
          : isSelected
          ? {
              scale: [1.12, 1.18, 1.12],
              y: [0, -4, 0],
              transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' },
            }
          : bubble.isHinted
          ? {
              scale: [1, 1.15, 1],
              transition: { repeat: Infinity, duration: 0.9, ease: 'easeInOut' },
            }
          : {
              scale: 1,
              opacity: 1,
              y: [0, -5, 0],
              x: [0, 3, 0],
              transition: {
                scale: { type: 'spring', stiffness: 350, damping: 22 },
                opacity: { duration: 0.3 },
                y: {
                  repeat: Infinity,
                  duration: 3 + (bubble.value % 3) * 0.8,
                  ease: 'easeInOut',
                },
                x: {
                  repeat: Infinity,
                  duration: 2.5 + (bubble.value % 2) * 0.7,
                  ease: 'easeInOut',
                },
              },
            }
      }
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      onClick={() => onClick(bubble)}
    >
      {/* Outer Glow / Selection Halo */}
      <div
        className={`w-full h-full rounded-full relative flex items-center justify-center transition-all duration-300 ${
          isSelected
            ? 'ring-4 ring-yellow-300 ring-offset-2 ring-offset-sky-950 shadow-[0_0_30px_rgba(253,224,71,0.95)]'
            : bubble.shaking
            ? 'ring-4 ring-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.9)]'
            : bubble.isHinted
            ? 'ring-3 ring-amber-300 ring-offset-1 shadow-[0_0_20px_rgba(245,158,11,0.8)]'
            : 'shadow-[0_8px_20px_rgba(0,0,0,0.45)]'
        }`}
        style={{
          background: theme.bgGradient,
          boxShadow: isSelected
            ? `0 0 25px #fde047, inset 0 0 15px rgba(255,255,255,0.7)`
            : `0 8px 18px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4), 0 0 16px ${theme.outerGlow}`,
        }}
      >
        {/* Subtle translucent rim */}
        <div
          className="absolute inset-0 rounded-full border-[2.5px] pointer-events-none opacity-80"
          style={{ borderColor: theme.borderTone }}
        />

        {/* PRIMARY SPECULAR HIGHLIGHT (Glossy reflection top-left) */}
        <div className="absolute top-1.5 left-2.5 w-[42%] h-[28%] rounded-[50%_50%_40%_40%] bg-gradient-to-b from-white/95 via-white/70 to-transparent transform -rotate-35 pointer-events-none filter blur-[0.2px]" />

        {/* SECONDARY SPECULAR HIGHLIGHT (Tiny dot highlight beside primary) */}
        <div className="absolute top-3 left-1.5 w-2 h-1.5 rounded-full bg-white/80 pointer-events-none" />

        {/* BOTTOM RIM REFLECTION (Translucent crescent reflecting seabed light) */}
        <div className="absolute bottom-1.5 right-2.5 w-[36%] h-[18%] rounded-full bg-white/25 pointer-events-none filter blur-[0.4px]" />

        {/* Micro air/foam specks floating inside bubble (like in screenshot) */}
        <div
          className="absolute bottom-3 left-3 w-2 h-2 rounded-full pointer-events-none"
          style={{ background: theme.innerSpecks }}
        />
        <div
          className="absolute top-4 right-3.5 w-2.5 h-2.5 rounded-full pointer-events-none"
          style={{ background: theme.innerSpecks }}
        />
        <div
          className="absolute bottom-3.5 right-4 w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{ background: theme.innerSpecks }}
        />

        {/* NUMBER: Always clearly visible inside the bubble! */}
        <div className="relative flex items-center justify-center pointer-events-none z-10">
          <span
            className="text-white font-extrabold select-none leading-none"
            style={{
              fontFamily: "'Lilita One', 'Fredoka', cursive, sans-serif",
              fontSize: bubble.radius > 32 ? '38px' : '30px',
              color: theme.numberColor,
              textShadow: `
                -2px -2px 0 ${theme.numberStroke},
                 2px -2px 0 ${theme.numberStroke},
                -2px  2px 0 ${theme.numberStroke},
                 2px  2px 0 ${theme.numberStroke},
                 0px  4px 8px rgba(0, 0, 0, 0.75)
              `,
            }}
          >
            {bubble.value}
          </span>
        </div>

        {/* Selected badge check / indicator */}
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 border-2 border-white shadow-md flex items-center justify-center text-[11px] font-black text-amber-950 animate-bounce z-30">
            ★
          </div>
        )}
      </div>
    </motion.div>
  );
};
