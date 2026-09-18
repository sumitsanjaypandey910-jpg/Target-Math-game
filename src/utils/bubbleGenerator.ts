import { BubbleItem, BubbleColorTheme } from '../types';

const COLOR_THEMES: BubbleColorTheme[] = [
  'purple',
  'gold',
  'green',
  'magenta',
  'pink',
  'sapphire',
  'coral',
];

// Predefined spread positions to avoid overlapping spawns while maintaining natural ocean look
const DEFAULT_SLOTS = [
  { x: 20, y: 22 },
  { x: 70, y: 20 },
  { x: 26, y: 40 },
  { x: 68, y: 44 },
  { x: 22, y: 62 },
  { x: 66, y: 68 },
  { x: 46, y: 26 },
  { x: 44, y: 72 },
];

let idCounter = 1;

export function generateInitialBubbles(targetSum = 10, count = 6): BubbleItem[] {
  const bubbles: BubbleItem[] = [];
  const usedSlots = [...DEFAULT_SLOTS].sort(() => Math.random() - 0.5).slice(0, count);

  // Guarantee at least 2 matching pairs
  const pair1A = Math.floor(Math.random() * (targetSum - 1)) + 1;
  const pair1B = targetSum - pair1A;

  let pair2A = Math.floor(Math.random() * (targetSum - 1)) + 1;
  while (pair2A === pair1A && targetSum > 2) {
    pair2A = Math.floor(Math.random() * (targetSum - 1)) + 1;
  }
  const pair2B = targetSum - pair2A;

  const numbers = [pair1A, pair1B, pair2A, pair2B];

  // Fill remaining slots with random numbers 1..(targetSum - 1)
  while (numbers.length < count) {
    numbers.push(Math.floor(Math.random() * (targetSum - 1)) + 1);
  }

  // Shuffle numbers
  numbers.sort(() => Math.random() - 0.5);

  numbers.forEach((val, i) => {
    const slot = usedSlots[i] || {
      x: 15 + Math.random() * 60,
      y: 15 + Math.random() * 60,
    };
    
    // Choose color theme: special matching pairs or vibrant variety
    const color = COLOR_THEMES[i % COLOR_THEMES.length];

    bubbles.push({
      id: `bubble-${idCounter++}`,
      value: val,
      x: slot.x + (Math.random() * 4 - 2),
      y: slot.y + (Math.random() * 4 - 2),
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
      colorTheme: color,
      radius: 36,
      spawnTime: Date.now(),
      revealUntil: Date.now() + 5000,
    });
  });

  return bubbles;
}

// Generate replacement pair or single bubbles to maintain target pairs on the board
export function generateReplacementBubbles(
  currentBubbles: BubbleItem[],
  targetSum = 10,
  neededCount = 2
): BubbleItem[] {
  const newBubbles: BubbleItem[] = [];

  // Check if current bubbles already contain at least one valid pair
  let hasValidPair = false;
  for (let i = 0; i < currentBubbles.length; i++) {
    for (let j = i + 1; j < currentBubbles.length; j++) {
      if (currentBubbles[i].value + currentBubbles[j].value === targetSum) {
        hasValidPair = true;
        break;
      }
    }
    if (hasValidPair) break;
  }

  // Determine values to spawn
  const newValues: number[] = [];
  if (!hasValidPair && neededCount >= 2) {
    // Force a valid pair
    const a = Math.floor(Math.random() * (targetSum - 1)) + 1;
    newValues.push(a, targetSum - a);
  } else if (!hasValidPair && currentBubbles.length > 0) {
    // Pick an existing bubble and spawn its complement!
    const partner = currentBubbles[Math.floor(Math.random() * currentBubbles.length)];
    if (partner.value < targetSum) {
      newValues.push(targetSum - partner.value);
    } else {
      newValues.push(1);
    }
    while (newValues.length < neededCount) {
      newValues.push(Math.floor(Math.random() * (targetSum - 1)) + 1);
    }
  } else {
    // Spawn balanced numbers with high probability of creating solvable pairs
    const a = Math.floor(Math.random() * (targetSum - 1)) + 1;
    newValues.push(a);
    if (neededCount > 1) {
      // 70% chance to also spawn complement
      if (Math.random() < 0.7) {
        newValues.push(targetSum - a);
      } else {
        newValues.push(Math.floor(Math.random() * (targetSum - 1)) + 1);
      }
    }
  }

  // Find spawn locations that are far enough from existing bubbles
  for (let k = 0; k < neededCount; k++) {
    const val = newValues[k] || Math.floor(Math.random() * (targetSum - 1)) + 1;
    const color = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
    
    // Pick a slot that doesn't collide with existing bubbles
    let bestX = 22 + Math.random() * 50;
    let bestY = 22 + Math.random() * 50;
    let maxMinDist = -1;

    for (let attempt = 0; attempt < 8; attempt++) {
      const candX = 18 + Math.random() * 58;
      const candY = 18 + Math.random() * 56;

      let minDist = 999;
      [...currentBubbles, ...newBubbles].forEach(b => {
        const dx = b.x - candX;
        const dy = b.y - candY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist) minDist = dist;
      });

      if (minDist > maxMinDist) {
        maxMinDist = minDist;
        bestX = candX;
        bestY = candY;
      }
    }

    newBubbles.push({
      id: `bubble-${idCounter++}`,
      value: val,
      x: bestX,
      y: bestY,
      vx: (Math.random() - 0.5) * 0.04,
      vy: (Math.random() - 0.5) * 0.04,
      colorTheme: color,
      radius: 36,
      spawnTime: Date.now(),
      revealUntil: Date.now() + 5000,
    });
  }

  return newBubbles;
}

// Export pool of common targets for dynamic addition games
export const TARGET_SUM_POOL = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20];

export function getNextTargetSum(current: number, pool = TARGET_SUM_POOL): number {
  const options = pool.filter((t) => t !== current);
  return options[Math.floor(Math.random() * options.length)] || 10;
}

// Ensure bubbles remaining on the board are compatible with the new target (< newTarget)
export function adaptBubblesToTarget(
  bubbles: BubbleItem[],
  newTarget: number
): BubbleItem[] {
  return bubbles.map((b) => {
    if (b.value >= newTarget) {
      return {
        ...b,
        value: Math.floor(Math.random() * (newTarget - 1)) + 1,
      };
    }
    return b;
  });
}

// Find a valid pair that equals targetSum for hints
export function findHintPair(bubbles: BubbleItem[], targetSum: number): [string, string] | null {
  for (let i = 0; i < bubbles.length; i++) {
    for (let j = i + 1; j < bubbles.length; j++) {
      if (bubbles[i].value + bubbles[j].value === targetSum) {
        return [bubbles[i].id, bubbles[j].id];
      }
    }
  }
  return null;
}
