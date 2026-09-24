import React from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Pause, Play, Lightbulb, RefreshCw, Shuffle, Waves } from 'lucide-react';
import { GameStats, GameSettings } from '../types';

interface GameHeaderProps {
  stats: GameStats;
  settings: GameSettings;
  selectedBubbleValue: number | null;
  onToggleSound: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  onUseHint: () => void;
  onRestart: () => void;
  onShuffleTarget?: () => void;
  onChangeTarget?: (newTarget: number) => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  stats,
  settings,
  selectedBubbleValue,
  onToggleSound,
  onTogglePause,
  isPaused,
  onUseHint,
  onRestart,
  onShuffleTarget,
}) => {
  // Timer icon pie calculation
  const totalTime = settings.timeLimit || 60;
  const timePercent = Math.max(0, Math.min(100, (stats.timeRemaining / totalTime) * 100));
  const isTimeCritical = stats.timeRemaining <= 10 && settings.mode !== 'endless';

  return (
    <div className="w-full flex flex-col items-center z-40 mb-1 px-1">
      {/* Top Status Bar (Score, Timer, Controls) */}
      <div className="w-full flex items-center justify-between text-white font-bold px-2 py-1">
        {/* Left Side: Score & Coins */}
        <div className="flex items-center gap-2">
          {/* Quick utility controls */}
          <div className="flex items-center gap-1 bg-sky-950/60 backdrop-blur-sm p-1 rounded-full border border-sky-600/40">
            <button
              onClick={onToggleSound}
              className="p-1.5 rounded-full hover:bg-sky-800/80 transition text-sky-200 hover:text-white"
              title={settings.soundEnabled ? 'Mute audio' : 'Unmute audio'}
              aria-label="Toggle sound"
            >
              {settings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} className="text-red-400" />}
            </button>
            <button
              onClick={onTogglePause}
              className="p-1.5 rounded-full hover:bg-sky-800/80 transition text-sky-200 hover:text-white"
              title={isPaused ? 'Resume' : 'Pause'}
              aria-label="Pause game"
            >
              {isPaused ? <Play size={16} className="text-emerald-400 fill-emerald-400" /> : <Pause size={16} />}
            </button>
            <button
              onClick={onUseHint}
              className="p-1.5 rounded-full hover:bg-sky-800/80 transition text-amber-300 hover:text-amber-100"
              title="Get a hint"
              aria-label="Hint"
            >
              <Lightbulb size={16} />
            </button>
            <button
              onClick={onRestart}
              className="p-1.5 rounded-full hover:bg-sky-800/80 transition text-sky-300 hover:text-white"
              title="Restart game"
              aria-label="Restart"
            >
              <RefreshCw size={15} />
            </button>
            {onShuffleTarget && (
              <button
                onClick={onShuffleTarget}
                className="p-1.5 rounded-full hover:bg-sky-800/80 transition text-amber-300 hover:text-white"
                title="Cycle Target Number"
                aria-label="Cycle Target Number"
              >
                <Shuffle size={15} />
              </button>
            )}
            <button
              onClick={onTogglePause}
              className={`p-1.5 rounded-full transition ${
                settings.soundEnabled && settings.soundscape !== 'off'
                  ? 'text-cyan-300 hover:bg-sky-800/80 hover:text-white'
                  : 'text-sky-400/50 hover:bg-sky-800/80 hover:text-sky-200'
              }`}
              title={`Underwater Soundscape: ${settings.soundscape.replace('_', ' ')} (Click to customize)`}
              aria-label="Soundscape Settings"
            >
              <Waves size={15} />
            </button>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-1.5 bg-sky-900/60 px-3 py-1 rounded-full border border-sky-400/30 shadow-inner">
            <span
              className="text-2xl text-white tracking-wide"
              style={{ fontFamily: "'Lilita One', cursive, sans-serif" }}
            >
              {stats.score}
            </span>
            {/* Gold Doubloon Coin Icon */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 border border-amber-300 flex items-center justify-center shadow-md">
              <div className="w-2.5 h-2.5 rounded-full border border-amber-600/70" />
            </div>
          </div>
        </div>

        {/* Right Side: Timer with circular clock indicator (matching screenshot) */}
        {settings.mode !== 'endless' ? (
          <div className={`flex items-center gap-2 ${isTimeCritical ? 'animate-pulse' : ''}`}>
            {/* Number of seconds */}
            <span
              className={`text-2xl tracking-wide ${
                isTimeCritical ? 'text-rose-400 font-black' : 'text-white'
              }`}
              style={{ fontFamily: "'Lilita One', cursive, sans-serif" }}
            >
              {stats.timeRemaining}
            </span>

            {/* Circular green clock indicator matching screenshot */}
            <div className="relative w-7 h-7 rounded-full bg-gradient-to-b from-[#86efac] via-[#22c55e] to-[#15803d] border-2 border-[#bbf7d0] shadow-md flex items-center justify-center overflow-hidden">
              {/* Radial tick overlay */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="rgba(0,0,0,0.15)"
                  strokeWidth="6"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="14"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="6"
                  strokeDasharray={`${(timePercent * 88) / 100} 100`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              {/* Clock needle in center */}
              <div className="absolute w-1 h-3 bg-emerald-950/80 rounded-full origin-bottom transform translate-y-[-2px]" />
              <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow" />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-400/40 text-emerald-200 text-xs font-semibold">
            <span>Zen Mode</span>
          </div>
        )}
      </div>

      {/* Main Prompt Banner (matching screenshot text: "Choose two numbers which make 10 in total") */}
      <div className="w-full text-center mt-0.5 mb-1 px-2">
        <h1
          className="text-lg sm:text-xl md:text-2xl text-white font-extrabold tracking-wide leading-tight flex items-center justify-center gap-1.5 flex-wrap"
          style={{
            fontFamily: "'Lilita One', 'Fredoka', cursive, sans-serif",
            textShadow: '0 2px 4px rgba(2, 44, 75, 0.95), 0 0 10px rgba(7, 89, 133, 0.75)',
          }}
        >
          <span>Choose two numbers which make</span>
          <motion.button
            key={settings.targetSum}
            initial={{ scale: 1.45, y: -4 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 18 }}
            onClick={onShuffleTarget}
            type="button"
            title="Target number automatically changes! Click to change immediately"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-200 hover:from-yellow-200 hover:to-amber-100 border-2 border-amber-500 text-amber-950 font-black shadow-[0_2px_8px_rgba(180,83,9,0.35)] cursor-pointer transition-all active:scale-95 group"
          >
            <span>{settings.targetSum}</span>
            {onShuffleTarget && (
              <Shuffle size={13} className="text-amber-800 ml-0.5" />
            )}
          </motion.button>
          <span>in total</span>
          {settings.dynamicTarget && (
            <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-500 shadow-sm ml-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-700 animate-ping inline-block" />
              Auto-Target
            </span>
          )}
        </h1>

        {/* Status guidance strip */}
        <div className="h-5 flex items-center justify-center mt-0.5">
          {selectedBubbleValue !== null ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sky-950/80 border border-amber-400/60 text-white text-xs font-semibold animate-pulse shadow-sm">
              <span>Selected: <strong className="text-amber-300 text-sm font-black">{selectedBubbleValue}</strong></span>
              <span className="text-sky-300">•</span>
              <span>Needs: <strong className="text-yellow-200 text-sm font-black">{settings.targetSum - selectedBubbleValue}</strong></span>
            </div>
          ) : stats.currentStreak > 1 ? (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-950/80 border border-amber-400/50 text-amber-300 text-xs font-black shadow-sm">
              <span>🔥 Streak x{stats.currentStreak}!</span>
            </div>
          ) : (
            <span className="text-[11px] font-bold text-sky-950 bg-white/70 px-2.5 py-0.5 rounded-full shadow-sm">
              Tap two bubbles that make {settings.targetSum}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
