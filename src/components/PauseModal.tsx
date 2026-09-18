import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Waves,
  Sparkles,
  Shuffle,
  Volume1,
} from 'lucide-react';
import { GameSettings, PopSoundType, SoundscapeType } from '../types';
import { soundFx } from '../utils/audio';

interface PauseModalProps {
  settings: GameSettings;
  onResume: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onSelectTarget: (target: number) => void;
  onToggleDynamicTarget: () => void;
  onSelectPopSound: (pop: PopSoundType) => void;
  onSelectSoundscape: (soundscape: SoundscapeType) => void;
  onSelectMode: (mode: 'classic' | 'endless' | 'rush') => void;
}

const POP_SOUND_OPTIONS: { id: PopSoundType; label: string; desc: string }[] = [
  { id: 'classic', label: 'Classic', desc: 'Crisp Wet Pop' },
  { id: 'crystal', label: 'Crystal', desc: 'Glassy Chime' },
  { id: 'deep', label: 'Deep', desc: 'Sub Thump' },
  { id: 'cartoon', label: 'Cartoon', desc: 'Spring Cork' },
  { id: 'arcade', label: 'Arcade', desc: '8-Bit Blip' },
];

const SOUNDSCAPE_OPTIONS: { id: SoundscapeType; label: string; desc: string }[] = [
  { id: 'off', label: 'Off', desc: 'No Ambient' },
  { id: 'deep_ocean', label: 'Deep Ocean', desc: 'Oceanic Hum & Swell' },
  { id: 'coral_reef', label: 'Coral Reef', desc: 'Aquatic Current & Ticks' },
  { id: 'whale_song', label: 'Whale Sanctuary', desc: 'Distant Whale Echoes' },
  { id: 'zen_tide', label: 'Zen Tide', desc: 'Calming Ambient Chords' },
];

export const PauseModal: React.FC<PauseModalProps> = ({
  settings,
  onResume,
  onRestart,
  onToggleSound,
  onSelectTarget,
  onToggleDynamicTarget,
  onSelectPopSound,
  onSelectSoundscape,
  onSelectMode,
}) => {
  const handlePopSelect = (popId: PopSoundType) => {
    onSelectPopSound(popId);
    // Play preview of pop sound immediately
    soundFx.playPop(popId);
  };

  const handleSoundscapeSelect = (scapeId: SoundscapeType) => {
    onSelectSoundscape(scapeId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-sky-950/85 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.88, opacity: 0 }}
        className="w-full max-w-sm my-auto rounded-[24px] p-3 bg-gradient-to-b from-[#e89b43] via-[#b6681f] to-[#6d3408] border-[3px] border-[#ffd580] shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
      >
        <div className="rounded-[18px] bg-gradient-to-b from-[#0e487a] via-[#08335b] to-[#041f3d] p-4 text-white flex flex-col items-center border border-sky-400/40 max-h-[85vh] overflow-y-auto scrollbar-thin">
          <h2
            className="text-2xl font-black text-amber-300 drop-shadow mb-3 text-center"
            style={{ fontFamily: "'Lilita One', cursive" }}
          >
            GAME SETTINGS
          </h2>

          {/* Primary Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={onResume}
              className="py-2.5 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 text-emerald-950 font-black shadow-md border border-emerald-200 flex items-center justify-center gap-1.5 transition active:scale-95"
              style={{ fontFamily: "'Lilita One', cursive" }}
            >
              <Play size={16} className="fill-current" />
              RESUME
            </button>

            <button
              onClick={onRestart}
              className="py-2 rounded-xl bg-sky-800 hover:bg-sky-700 text-sky-100 font-bold text-xs shadow border border-sky-500/40 flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw size={15} />
              Restart Game
            </button>
          </div>

          {/* Master Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`w-full py-2 mb-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition border ${
              settings.soundEnabled
                ? 'bg-emerald-950/70 text-emerald-200 border-emerald-500/50 hover:bg-emerald-900/80'
                : 'bg-rose-950/70 text-rose-200 border-rose-500/50 hover:bg-rose-900/80'
            }`}
          >
            {settings.soundEnabled ? (
              <>
                <Volume2 size={16} className="text-emerald-400" />
                Master Sound: <span className="text-emerald-300 font-extrabold">ON</span>
              </>
            ) : (
              <>
                <VolumeX size={16} className="text-rose-400" />
                Master Sound: <span className="text-rose-300 font-extrabold">MUTED</span>
              </>
            )}
          </button>

          {/* UNDERWATER SOUNDSCAPES */}
          <div className="w-full mb-3 p-2.5 rounded-xl bg-sky-950/70 border border-sky-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-200">
                <Waves size={14} className="text-cyan-400" />
                <span>Underwater Soundscape</span>
              </div>
              <span className="text-[10px] text-cyan-300 font-semibold uppercase">
                {settings.soundscape === 'off' ? 'Disabled' : settings.soundscape.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {SOUNDSCAPE_OPTIONS.map((scape) => (
                <button
                  key={scape.id}
                  onClick={() => handleSoundscapeSelect(scape.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-left transition flex items-center justify-between border ${
                    settings.soundscape === scape.id
                      ? 'bg-cyan-500/25 border-cyan-400 text-cyan-100 shadow-sm'
                      : 'bg-sky-900/40 border-sky-800/40 text-sky-300 hover:bg-sky-900/70'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-tight">{scape.label}</span>
                    <span className="text-[10px] text-sky-300/80">{scape.desc}</span>
                  </div>
                  {settings.soundscape === scape.id && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* BUBBLE POP SOUND VARIATIONS */}
          <div className="w-full mb-3 p-2.5 rounded-xl bg-sky-950/70 border border-sky-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-200">
                <Sparkles size={14} className="text-yellow-400" />
                <span>Bubble Pop Sound</span>
              </div>
              <span className="text-[10px] text-yellow-300 font-semibold uppercase">
                {settings.popSound}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {POP_SOUND_OPTIONS.map((pop) => (
                <button
                  key={pop.id}
                  onClick={() => handlePopSelect(pop.id)}
                  className={`px-2 py-1.5 rounded-lg text-left transition flex items-center justify-between border ${
                    settings.popSound === pop.id
                      ? 'bg-amber-500/25 border-amber-400 text-amber-100 shadow-sm'
                      : 'bg-sky-900/40 border-sky-800/40 text-sky-300 hover:bg-sky-900/70'
                  }`}
                  title="Click to preview this bubble pop sound"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{pop.label}</span>
                    <span className="text-[9px] text-sky-300/80">{pop.desc}</span>
                  </div>
                  <Volume1 size={13} className={settings.popSound === pop.id ? 'text-amber-300' : 'text-sky-500'} />
                </button>
              ))}
            </div>
          </div>

          {/* TARGET NUMBER SETTING */}
          <div className="w-full mb-3 p-2.5 rounded-xl bg-sky-950/70 border border-sky-700/50">
            {/* Dynamic Target Toggle */}
            <button
              onClick={onToggleDynamicTarget}
              className={`w-full py-1.5 px-2.5 rounded-lg mb-2 font-bold text-xs flex items-center justify-between border transition ${
                settings.dynamicTarget
                  ? 'bg-amber-400/20 border-amber-400/70 text-amber-200'
                  : 'bg-sky-900/40 border-sky-700/60 text-sky-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Shuffle size={14} className={settings.dynamicTarget ? 'text-amber-300' : 'text-sky-400'} />
                <span>Auto-Change Target Sum</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-black ${
                  settings.dynamicTarget
                    ? 'bg-amber-400 text-amber-950'
                    : 'bg-sky-800 text-sky-300'
                }`}
              >
                {settings.dynamicTarget ? 'ON (10 → 12 → 8)' : 'FIXED'}
              </span>
            </button>

            <div className="text-[10px] text-sky-300 font-semibold mb-1 flex items-center justify-between">
              <span>{settings.dynamicTarget ? 'STARTING / CURRENT TARGET:' : 'CHOOSE TARGET:'}</span>
              <span className="text-amber-300 font-bold">{settings.targetSum}</span>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {[8, 10, 12, 15].map((t) => (
                <button
                  key={t}
                  onClick={() => onSelectTarget(t)}
                  className={`py-1 rounded text-xs font-bold transition ${
                    settings.targetSum === t
                      ? 'bg-amber-400 text-amber-950 ring-2 ring-white font-black'
                      : 'bg-sky-900/80 text-sky-200 hover:bg-sky-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* GAME MODE */}
          <div className="w-full text-center">
            <div className="text-[10px] text-sky-300 font-semibold mb-1">GAME MODE:</div>
            <div className="grid grid-cols-3 gap-1">
              {(['classic', 'rush', 'endless'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => onSelectMode(m)}
                  className={`py-1.5 rounded text-[11px] font-bold capitalize transition ${
                    settings.mode === m
                      ? 'bg-emerald-400 text-emerald-950 ring-2 ring-white'
                      : 'bg-sky-950 text-sky-300 hover:bg-sky-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
