/**
 * Gamification Types — POSEHANUM
 * XP, Levels, Streaks, Daily Challenges, Achievements
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
  progress: number; // 0 to 1
  isUnlocked: boolean;
}

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  targetPoseId: string;
  targetCategory: string;
  minScore: number;
  xpReward: number;
  isCompleted: boolean;
}

export interface GamificationProfile {
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  completedChallengeIds: string[];
  unlockedAchievementIds: string[];
  totalCaptures: number;
  perfectMatches: number; // >= 95%
}
