/**
 * Gamification Level Calculator for ViniGames.
 * Implements the progression formula: N = floor((XP / 100)^(2/3)) + 1
 */

/**
 * Calculates the current level based on total XP.
 * @param xp Total XP accumulated by the player
 */
export function getLevel(xp: number): number {
  if (xp < 0) return 1;
  return Math.floor(Math.pow(xp / 100, 2 / 3)) + 1;
}

/**
 * Calculates the minimum XP required to reach a specific level.
 * Formula: XP = 100 * (level - 1)^1.5
 * @param level Target level
 */
export function getXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

/**
 * Calculates the player's progress toward the next level.
 * @param xp Total XP accumulated by the player
 */
export function getLevelProgress(xp: number): {
  level: number;
  currentXpInLevel: number;
  xpNeededForNextLevel: number;
  percentage: number;
} {
  const level = getLevel(xp);
  const minXpForCurrent = getXpForLevel(level);
  const minXpForNext = getXpForLevel(level + 1);
  
  const xpInLevel = xp - minXpForCurrent;
  const xpNeeded = minXpForNext - minXpForCurrent;
  
  // Calculate percentage (avoid division by zero)
  const percentage = xpNeeded > 0 ? Math.min(100, Math.max(0, (xpInLevel / xpNeeded) * 100)) : 0;
  
  return {
    level,
    currentXpInLevel: xpInLevel,
    xpNeededForNextLevel: xpNeeded,
    percentage: Math.round(percentage),
  };
}
