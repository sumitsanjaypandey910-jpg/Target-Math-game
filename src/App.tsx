import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { UnderwaterScene } from './components/UnderwaterScene';
import { Bubble } from './components/Bubble';
import { GameHeader } from './components/GameHeader';
import { GameOverModal } from './components/GameOverModal';
import { PauseModal } from './components/PauseModal';
import { PopEffects } from './components/PopEffects';
import { soundFx } from './utils/audio';
import {
  generateInitialBubbles,
  generateReplacementBubbles,
  findHintPair,
  getNextTargetSum,
  adaptBubblesToTarget,
} from './utils/bubbleGenerator';
import {
  BubbleItem,
  GameSettings,
  GameStats,
  ScorePopup,
  PopParticle,
  PopSoundType,
  SoundscapeType,
} from './types';

const HIGH_SCORE_KEY = 'sea_bubble_sum_high_score';

export default function App() {
  // Game Configuration & Settings
  const [settings, setSettings] = useState<GameSettings>({
    targetSum: 10,
    timeLimit: 60,
    bubbleCount: 6,
    soundEnabled: true,
    mode: 'classic',
    dynamicTarget: true, // Auto-changes target number after matches (10 → 12 → 8 → 15...)
    popSound: 'classic',
    soundscape: 'deep_ocean',
  });

  // Game Statistics
  const [stats, setStats] = useState<GameStats>(() => {
    const savedHighScore = localStorage.getItem(HIGH_SCORE_KEY);
    return {
      score: 0,
      coins: 0,
      matchesMade: 0,
      attempts: 0,
      bestStreak: 0,
      currentStreak: 0,
      timeRemaining: 60,
      highScore: savedHighScore ? parseInt(savedHighScore, 10) : 0,
    };
  });

  // Gameplay State
  const [bubbles, setBubbles] = useState<BubbleItem[]>(() =>
    generateInitialBubbles(10, 6)
  );
  const [selectedBubble, setSelectedBubble] = useState<BubbleItem | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [targetNotification, setTargetNotification] = useState<number | null>(null);

  // Visual Effects
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [particles, setParticles] = useState<PopParticle[]>([]);

  // Synchronize audio engine with settings
  useEffect(() => {
    soundFx.enabled = settings.soundEnabled;
    soundFx.popVariation = settings.popSound;
    if (settings.soundEnabled && !isPaused && !isGameOver) {
      soundFx.setSoundscape(settings.soundscape);
    } else {
      soundFx.stopSoundscape();
    }
    return () => {
      soundFx.stopSoundscape();
    };
  }, [settings.soundEnabled, settings.popSound, settings.soundscape, isPaused, isGameOver]);

  // Initialize/Restart the Game
  const handleRestart = useCallback(() => {
    soundFx.playReveal();
    setBubbles(generateInitialBubbles(settings.targetSum, settings.bubbleCount));
    setSelectedBubble(null);
    setIsPaused(false);
    setIsGameOver(false);
    setIsEvaluating(false);
    setScorePopups([]);
    setParticles([]);

    setStats((prev) => ({
      ...prev,
      score: 0,
      coins: 0,
      matchesMade: 0,
      attempts: 0,
      currentStreak: 0,
      timeRemaining: settings.mode === 'rush' ? 30 : settings.timeLimit,
    }));
  }, [settings]);

  // Manually change or cycle the target sum
  const handleCycleTarget = (specificTarget?: number) => {
    const newTarget = specificTarget ?? getNextTargetSum(settings.targetSum);
    soundFx.playTargetChanged(newTarget);
    setSettings((prev) => ({ ...prev, targetSum: newTarget }));
    setSelectedBubble(null);
    setTargetNotification(newTarget);
    setTimeout(() => setTargetNotification(null), 1800);

    setBubbles((prev) => {
      const adapted = adaptBubblesToTarget(prev, newTarget);
      let hasPair = false;
      for (let i = 0; i < adapted.length; i++) {
        for (let j = i + 1; j < adapted.length; j++) {
          if (adapted[i].value + adapted[j].value === newTarget) {
            hasPair = true;
            break;
          }
        }
        if (hasPair) break;
      }

      if (!hasPair && adapted.length >= 2) {
        const a = Math.floor(Math.random() * (newTarget - 1)) + 1;
        const b = newTarget - a;
        return adapted.map((bItem, idx) => {
          if (idx === 0) return { ...bItem, value: a, isHinted: false };
          if (idx === 1) return { ...bItem, value: b, isHinted: false };
          return { ...bItem, isHinted: false };
        });
      }
      return adapted;
    });
  };

  const handleChangeTarget = (newTarget: number) => {
    handleCycleTarget(newTarget);
    setIsPaused(false);
  };

  const handleToggleDynamicTarget = () => {
    setSettings((prev) => ({ ...prev, dynamicTarget: !prev.dynamicTarget }));
  };

  const handleSelectPopSound = (popSound: PopSoundType) => {
    setSettings((prev) => ({ ...prev, popSound }));
    soundFx.popVariation = popSound;
  };

  const handleSelectSoundscape = (soundscape: SoundscapeType) => {
    setSettings((prev) => ({ ...prev, soundscape }));
    soundFx.setSoundscape(settings.soundEnabled ? soundscape : 'off');
  };

  // Handle Game Mode Change
  const handleChangeMode = (mode: 'classic' | 'endless' | 'rush') => {
    const newLimit = mode === 'rush' ? 30 : 60;
    setSettings((prev) => ({ ...prev, mode, timeLimit: newLimit }));
    setStats((prev) => ({
      ...prev,
      timeRemaining: newLimit,
    }));
    handleRestart();
  };

  // Sound Toggle
  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    soundFx.enabled = next;
    setSettings((prev) => ({ ...prev, soundEnabled: next }));
  };

  // Pause Toggle
  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Lightbulb Hint Feature: Highlights two matching bubbles
  const handleUseHint = () => {
    if (isPaused || isGameOver) return;
    const pair = findHintPair(bubbles, settings.targetSum);
    if (!pair) return;

    soundFx.playSelect(1.4);
    const [idA, idB] = pair;

    setBubbles((prev) =>
      prev.map((b) => (b.id === idA || b.id === idB ? { ...b, isHinted: true } : b))
    );

    setTimeout(() => {
      setBubbles((prev) => prev.map((b) => ({ ...b, isHinted: false })));
    }, 2500);
  };

  // Particle System Animation Frame Loop
  useEffect(() => {
    if (particles.length === 0) return;

    const frame = requestAnimationFrame(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.4,
            y: p.y + p.vy * 0.4,
            vy: p.vy + 0.08,
            alpha: p.alpha - 0.035,
          }))
          .filter((p) => p.alpha > 0)
      );
    });

    return () => cancelAnimationFrame(frame);
  }, [particles]);

  // Create Water Pop Particle Splash
  const createPopParticles = (x: number, y: number, colorTheme: string) => {
    const count = 12;
    const newParticles: PopParticle[] = [];
    const colors = ['#ffffff', '#bae6fd', '#38bdf8', '#0284c7'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = 1.5 + Math.random() * 3.5;
      newParticles.push({
        id: `particle-${Date.now()}-${i}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 4 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1.0,
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);
  };

  // Ambient Bubble Gentle Drift Physics (contained strictly inside screen bounds)
  useEffect(() => {
    if (isPaused || isGameOver) return;

    const driftInterval = setInterval(() => {
      setBubbles((prev) => {
        return prev.map((b, i) => {
          if (b.popping) return b;

          let nx = b.x + b.vx;
          let ny = b.y + b.vy;
          let nvx = b.vx;
          let nvy = b.vy;

          // Gentle bounce off screen bounds (within playfield window)
          if (nx < 16) {
            nx = 16;
            nvx = Math.abs(nvx);
          } else if (nx > 78) {
            nx = 78;
            nvx = -Math.abs(nvx);
          }

          if (ny < 14) {
            ny = 14;
            nvy = Math.abs(nvy);
          } else if (ny > 76) {
            ny = 76;
            nvy = -Math.abs(nvy);
          }

          // Subtle mutual bubble repulsion
          for (let j = 0; j < prev.length; j++) {
            if (i === j) continue;
            const other = prev[j];
            const dx = nx - other.x;
            const dy = ny - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 18 && dist > 0.01) {
              const force = (18 - dist) * 0.003;
              nvx += (dx / dist) * force;
              nvy += (dy / dist) * force;
            }
          }

          // Damping to keep drift smooth and calm
          nvx = Math.max(-0.06, Math.min(0.06, nvx * 0.99));
          nvy = Math.max(-0.06, Math.min(0.06, nvy * 0.99));

          return {
            ...b,
            x: nx,
            y: ny,
            vx: nvx,
            vy: nvy,
          };
        });
      });
    }, 40);

    return () => clearInterval(driftInterval);
  }, [isPaused, isGameOver]);

  // Game Timer Loop
  useEffect(() => {
    if (isPaused || isGameOver || settings.mode === 'endless') return;

    const timer = setInterval(() => {
      setStats((prev) => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer);
          setIsGameOver(true);
          soundFx.playVictory();
          return { ...prev, timeRemaining: 0 };
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, isGameOver, settings.mode]);

  // Handle Bubble Click / Selection
  const handleBubbleClick = (bubble: BubbleItem) => {
    if (isPaused || isGameOver || isEvaluating || bubble.popping) return;

    // Wake up audio context on user interaction
    soundFx.getContext();

    // If no bubble selected yet: select this first one
    if (!selectedBubble) {
      soundFx.playSelect(1.0);
      setSelectedBubble(bubble);
      return;
    }

    // If player tapped the same bubble again: deselect
    if (selectedBubble.id === bubble.id) {
      soundFx.playSelect(0.85);
      setSelectedBubble(null);
      return;
    }

    // Two bubbles are now selected: Evaluate their sum!
    setIsEvaluating(true);
    const sum = selectedBubble.value + bubble.value;

    if (sum === settings.targetSum) {
      // SUCCESSFUL MATCH!
      const nextStreak = stats.currentStreak + 1;
      soundFx.playSuccess(nextStreak);
      soundFx.playPop(settings.popSound);

      const gainedScore = 100 * nextStreak;

      // Confetti burst on notable streaks
      if (nextStreak % 3 === 0) {
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { x: bubble.x / 100, y: bubble.y / 100 },
            colors: ['#38bdf8', '#fbbf24', '#34d399', '#f472b6'],
          });
        } catch {
          // Ignore
        }
      }

      // Mark matched bubbles as popping
      setBubbles((prev) =>
        prev.map((b) =>
          b.id === selectedBubble.id || b.id === bubble.id
            ? { ...b, popping: true }
            : b
        )
      );

      // Create water pop splash particles
      createPopParticles(selectedBubble.x, selectedBubble.y, selectedBubble.colorTheme);
      createPopParticles(bubble.x, bubble.y, bubble.colorTheme);

      // Spawn floating score popup
      const midX = (selectedBubble.x + bubble.x) / 2;
      const midY = (selectedBubble.y + bubble.y) / 2;
      const popupText = nextStreak > 1 ? `+${gainedScore} (x${nextStreak}!)` : `+${gainedScore}`;

      const popupId = `score-${Date.now()}`;
      setScorePopups((prev) => [
        ...prev,
        { id: popupId, x: midX, y: midY, text: popupText },
      ]);

      setTimeout(() => {
        setScorePopups((prev) => prev.filter((p) => p.id !== popupId));
      }, 900);

      // Update statistics
      setStats((prev) => {
        const newScore = prev.score + gainedScore;
        const newHigh = Math.max(newScore, prev.highScore);
        if (newScore > prev.highScore) {
          localStorage.setItem(HIGH_SCORE_KEY, newHigh.toString());
        }
        return {
          ...prev,
          score: newScore,
          coins: prev.coins + 1,
          matchesMade: prev.matchesMade + 1,
          attempts: prev.attempts + 1,
          currentStreak: nextStreak,
          bestStreak: Math.max(prev.bestStreak, nextStreak),
          highScore: newHigh,
        };
      });

      // Handle Dynamic Target Number Change:
      // "Keep changing the target number like he changing the 10"
      let nextTarget = settings.targetSum;
      if (settings.dynamicTarget) {
        nextTarget = getNextTargetSum(settings.targetSum);
        soundFx.playTargetChanged(nextTarget);
        setSettings((prev) => ({ ...prev, targetSum: nextTarget }));
        setTargetNotification(nextTarget);
        setTimeout(() => setTargetNotification(null), 1800);
      }

      // Remove popped bubbles, adapt board, and spawn replacement pair
      setTimeout(() => {
        setBubbles((prev) => {
          const remaining = prev.filter(
            (b) => b.id !== selectedBubble.id && b.id !== bubble.id
          );
          const adapted = settings.dynamicTarget
            ? adaptBubblesToTarget(remaining, nextTarget)
            : remaining;

          const needed = settings.bubbleCount - adapted.length;
          const replacements = generateReplacementBubbles(
            adapted,
            nextTarget,
            needed
          );
          return [...adapted, ...replacements];
        });

        setSelectedBubble(null);
        setIsEvaluating(false);
      }, 320);
    } else {
      // INCORRECT PAIR
      soundFx.playError();

      // Trigger shake animation on both bubbles
      setBubbles((prev) =>
        prev.map((b) =>
          b.id === selectedBubble.id || b.id === bubble.id
            ? { ...b, shaking: true }
            : b
        )
      );

      // Reset streak and record attempt
      setStats((prev) => ({
        ...prev,
        attempts: prev.attempts + 1,
        currentStreak: 0,
      }));

      // Clear shaking and selection after short duration
      setTimeout(() => {
        setBubbles((prev) =>
          prev.map((b) => ({ ...b, shaking: false }))
        );
        setSelectedBubble(null);
        setIsEvaluating(false);
      }, 420);
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-[#e0f7fa] via-[#e1f5fe] to-[#b3e5fc]">
      <UnderwaterScene>
        {/* Game Top Header (Score, Timer, Prompt Banner, Controls) */}
        <GameHeader
          stats={stats}
          settings={settings}
          selectedBubbleValue={selectedBubble ? selectedBubble.value : null}
          onToggleSound={handleToggleSound}
          onTogglePause={handleTogglePause}
          isPaused={isPaused}
          onUseHint={handleUseHint}
          onRestart={handleRestart}
          onShuffleTarget={handleCycleTarget}
          onChangeTarget={handleChangeTarget}
        />

        {/* Floating Dynamic Target Banner Notification */}
        <AnimatePresence>
          {targetNotification !== null && (
            <motion.div
              initial={{ scale: 0.6, y: -25, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 450, damping: 20 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/95 via-orange-500/95 to-amber-500/95 border-2 border-yellow-300 shadow-[0_0_30px_rgba(251,191,36,0.9)] text-white text-center flex items-center gap-2.5 backdrop-blur-md"
            >
              <span className="text-2xl">🎯</span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-100">
                  Target Changed!
                </span>
                <span
                  className="text-xl font-black text-yellow-200 leading-tight"
                  style={{ fontFamily: "'Lilita One', cursive" }}
                >
                  Make {targetNotification}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Numbered Bubbles Area */}
        <div className="relative w-full h-[80%] overflow-hidden">
          {bubbles.map((bubble) => (
            <Bubble
              key={bubble.id}
              bubble={bubble}
              isSelected={selectedBubble?.id === bubble.id}
              onClick={handleBubbleClick}
            />
          ))}

          {/* Visual Splash & Score Popups */}
          <PopEffects scorePopups={scorePopups} particles={particles} />
        </div>
      </UnderwaterScene>

      {/* Pause / Settings Modal */}
      {isPaused && (
        <PauseModal
          settings={settings}
          onResume={() => setIsPaused(false)}
          onRestart={handleRestart}
          onToggleSound={handleToggleSound}
          onSelectTarget={handleChangeTarget}
          onToggleDynamicTarget={handleToggleDynamicTarget}
          onSelectPopSound={handleSelectPopSound}
          onSelectSoundscape={handleSelectSoundscape}
          onSelectMode={handleChangeMode}
        />
      )}

      {/* Game Over / Results Modal */}
      {isGameOver && (
        <GameOverModal
          stats={stats}
          settings={settings}
          onRestart={handleRestart}
          onSelectTarget={handleChangeTarget}
          onSelectMode={handleChangeMode}
        />
      )}
    </div>
  );
}
