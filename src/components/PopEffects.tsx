import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScorePopup, PopParticle } from '../types';

interface PopEffectsProps {
  scorePopups: ScorePopup[];
  particles: PopParticle[];
}

export const PopEffects: React.FC<PopEffectsProps> = ({ scorePopups, particles }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Water Pop Splash Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.alpha,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 6px ${p.color}`,
          }}
        />
      ))}

      {/* Floating Score Popups (+100, +200, Streak x2!) */}
      <AnimatePresence>
        {scorePopups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: -45, scale: 1.2 }}
            exit={{ opacity: 0, y: -65, scale: 0.8 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="absolute z-50 pointer-events-none font-black text-center"
            style={{
              left: `${popup.x}%`,
              top: `${popup.y}%`,
              transform: 'translate(-50%, -50%)',
              fontFamily: "'Lilita One', cursive, sans-serif",
            }}
          >
            <span
              className="text-2xl sm:text-3xl text-yellow-300 drop-shadow-[0_3px_6px_rgba(0,0,0,0.9)]"
              style={{
                textShadow: `
                  -2px -2px 0 #78350f,
                   2px -2px 0 #78350f,
                  -2px  2px 0 #78350f,
                   2px  2px 0 #78350f,
                   0 0 12px rgba(253, 224, 71, 0.8)
                `,
              }}
            >
              {popup.text}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
