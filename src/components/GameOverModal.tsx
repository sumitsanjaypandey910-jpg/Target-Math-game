import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Flame, CheckCircle, Zap } from 'lucide-react';
import { GameStats, GameSettings } from '../types';

interface GameOverModalProps {
  stats: GameStats;
  settings: GameSettings;
  onRestart: () => void;
  onSelectTarget: (target: number) => void;
  onSelectMode: (mode: 'classic' | 'endless' | 'rush') => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  settings,
  onRestart,
  onSelectTarget,
  onSelectMode,
}) => {
  // Determine stars based on score
  const stars = stats.score >= 500 ? 3 : stats.score >= 250 ? 2 : 1;
  const accuracy = stats.attempts > 0 ? Math.round((stats.matchesMade / stats.attempts) * 100) : 0;
  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/80 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-sm rounded-[24px] p-4 bg-gradient-to-b from-[#e89b43] via-[#b6681f] to-[#6d3408] border-[3px] border-[#ffd580] shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        <div className="rounded-[18px] bg-gradient-to-b from-[#0e487a] to-[#041f3d] p-5 text-white flex flex-col items-center border border-sky-400/40 shadow-inner">
          {/* Header Title */}
          <div className="text-center mb-3">
            <h2
              className="text-2xl font-black text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
              style={{ fontFamily: "'Lilita One', cursive" }}
            >
              TIME'S UP!
            </h2>
            <p className="text-xs text-sky-200">Ocean Math Explorer</p>
          </div>

          {/* Stars display */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3].map((starIdx) => (
              <motion.div
                key={starIdx}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: starIdx <= stars ? 1 : 0.8, rotate: 0 }}
                transition={{ delay: 0.2 + starIdx * 0.15 }}
                className={`text-3xl ${
                  starIdx <= stars
                    ? 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]'
                    : 'text-slate-600 opacity-40'
                }`}
              >
                ★
              </motion.div>
            ))}
          </div>

          {/* Score highlight */}
          <div className="w-full bg-sky-900/60 rounded-xl p-3 border border-sky-500/30 flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy size={22} className="text-amber-400" />
              <div className="text-left">
                <div className="text-[11px] text-sky-200">FINAL SCORE</div>
                <div
                  className="text-2xl font-black text-white"
                  style={{ fontFamily: "'Lilita One', cursive" }}
                >
                  {stats.score}
                </div>
              </div>
            </div>

            {isNewHighScore && (
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/40 text-[10px] font-bold animate-pulse">
                NEW BEST!
              </span>
            )}
          </div>

          {/* Stats Grid */}
          <div className="w-full grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-sky-950/70 p-2 rounded-lg border border-sky-800">
              <div className="flex items-center justify-center text-emerald-400 mb-0.5">
                <CheckCircle size={14} />
              </div>
              <div className="text-xs font-bold text-white">{stats.matchesMade}</div>
              <div className="text-[9px] text-sky-300">Pairs Made</div>
            </div>

            <div className="bg-sky-950/70 p-2 rounded-lg border border-sky-800">
              <div className="flex items-center justify-center text-amber-400 mb-0.5">
                <Flame size={14} />
              </div>
              <div className="text-xs font-bold text-white">{stats.bestStreak}x</div>
              <div className="text-[9px] text-sky-300">Max Streak</div>
            </div>

            <div className="bg-sky-950/70 p-2 rounded-lg border border-sky-800">
              <div className="flex items-center justify-center text-cyan-400 mb-0.5">
                <Zap size={14} />
              </div>
              <div className="text-xs font-bold text-white">{accuracy}%</div>
              <div className="text-[9px] text-sky-300">Accuracy</div>
            </div>
          </div>

          {/* Target Sum Picker */}
          <div className="w-full mb-4">
            <div className="text-[10px] text-sky-300 font-semibold mb-1 text-center">
              CHOOSE TARGET SUM:
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[10, 12, 15, 20].map((t) => (
                <button
                  key={t}
                  onClick={() => onSelectTarget(t)}
                  className={`py-1 rounded-lg text-xs font-extrabold transition ${
                    settings.targetSum === t
                      ? 'bg-amber-400 text-amber-950 shadow-md ring-2 ring-white'
                      : 'bg-sky-900/80 text-sky-200 hover:bg-sky-800'
                  }`}
                >
                  Make {t}
                </button>
              ))}
            </div>
          </div>

          {/* Game Mode Picker */}
          <div className="w-full mb-4">
            <div className="text-[10px] text-sky-300 font-semibold mb-1 text-center">
              GAME MODE:
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(['classic', 'rush', 'endless'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onSelectMode(m)}
                  className={`py-1 rounded-lg text-[11px] font-bold capitalize transition ${
                    settings.mode === m
                      ? 'bg-emerald-400 text-emerald-950 shadow-md ring-2 ring-white'
                      : 'bg-sky-900/80 text-sky-200 hover:bg-sky-800'
                  }`}
                >
                  {m === 'classic' ? '60s Classic' : m === 'rush' ? '30s Rush' : 'Zen Endless'}
                </button>
              ))}
            </div>
          </div>

          {/* Play Again Button */}
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-amber-950 font-black text-lg shadow-[0_4px_14px_rgba(245,158,11,0.5)] border-2 border-amber-200 flex items-center justify-center gap-2 transform active:scale-95 transition"
            style={{ fontFamily: "'Lilita One', cursive" }}
          >
            <RotateCcw size={20} />
            PLAY AGAIN
          </button>
        </div>
      </motion.div>
    </div>
  );
};
