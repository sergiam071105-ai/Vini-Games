export type AchievementCategory =
  | "EXPLORATION"
  | "COMPETITIVE"
  | "COLLECTION"
  | "SOCIAL";

export interface GamificationProfile {
  id: string;
  username: string;
  avatarUrl?: string | null;

  totalXp: number;
  gamecoinsBalance: number;

  currentStreak: number;
  longestStreak: number;

  title: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;

  xpReward: number;
  gamecoinsReward: number;

  unlocked: boolean;
}

export interface StreakDay {
  day: number;
  completed: boolean;
  current: boolean;
  rewardXp?: number;
}

export interface GamificationData {
  profile: GamificationProfile;
  achievements: Achievement[];
  streakDays: StreakDay[];
}