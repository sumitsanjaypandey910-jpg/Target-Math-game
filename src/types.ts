export interface BubbleItem {
  id: string;
  value: number;
  x: number; // percentage 5% to 85%
  y: number; // percentage 10% to 75%
  vx: number; // horizontal drift velocity
  vy: number; // vertical drift velocity
  colorTheme: BubbleColorTheme;
  radius: number; // base pixel size
  popping?: boolean;
  shaking?: boolean;
  isHinted?: boolean;
  spawnTime?: number;
  revealUntil?: number; // timestamp for 5 seconds on screen
  isRevealed?: boolean;
}

export type BubbleColorTheme = 
  | 'purple'
  | 'gold'
  | 'green'
  | 'magenta'
  | 'pink'
  | 'sapphire'
  | 'coral';

export interface ScorePopup {
  id: string;
  x: number;
  y: number;
  text: string;
  color?: string;
}

export interface PopParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

export type GameMode = 'classic' | 'endless' | 'rush';
export type PopSoundType = 'classic' | 'crystal' | 'deep' | 'cartoon' | 'arcade';
export type SoundscapeType = 'off' | 'deep_ocean' | 'coral_reef' | 'whale_song' | 'zen_tide';

export interface GameSettings {
  targetSum: number;
  timeLimit: number; // in seconds
  bubbleCount: number;
  soundEnabled: boolean;
  mode: GameMode;
  dynamicTarget: boolean; // Keep changing target sum like 10 -> 12 -> 8 -> 15
  popSound: PopSoundType;
  soundscape: SoundscapeType;
  fiveSecTimer?: boolean;
  threeSecVisibility?: boolean;
}

export interface GameStats {
  score: number;
  coins: number;
  matchesMade: number;
  attempts: number;
  bestStreak: number;
  currentStreak: number;
  timeRemaining: number;
  highScore: number;
}
