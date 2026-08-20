/**
 * GamificationEngine — Pure business logic for XP calculations, leveling, streak decay, and challenge logic.
 */

import type { Achievement, DailyChallenge, GamificationProfile } from '../types';
import { SNAP_POSE_DATASET } from '@/features/poses/data/posesData';

export class GamificationEngine {
  /**
   * XP threshold formula: Level N requires N * 250 XP
   */
  static getLevelFromXP(xp: number): number {
    return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
  }

  static getXPForNextLevel(level: number): number {
    return Math.pow(level, 2) * 100;
  }

  static getXPProgressInLevel(xp: number, level: number): { current: number; target: number; percentage: number } {
    const prevThreshold = Math.pow(level - 1, 2) * 100;
    const nextThreshold = Math.pow(level, 2) * 100;
    const current = Math.max(0, xp - prevThreshold);
    const target = nextThreshold - prevThreshold;
    const percentage = Math.min(100, Math.max(0, (current / target) * 100));
    return { current, target, percentage };
  }

  /**
   * Standard achievements list
   */
  static getStandardAchievements(): Achievement[] {
    return [
      {
        id: 'first_snap',
        title: 'First Lens',
        description: 'Complete your first pose alignment capture',
        icon: 'camera',
        xpReward: 100,
        progress: 0,
        isUnlocked: false,
      },
      {
        id: 'daily_director_challenge',
        title: 'Daily Director Challenge',
        description: 'Complete today’s featured AI Director challenge with ≥85% match',
        icon: 'target',
        xpReward: 200,
        progress: 0,
        isUnlocked: false,
      },
      {
        id: 'streak_3',
        title: 'Daily Rhythm',
        description: 'Maintain a 3-day capture streak',
        icon: 'flame',
        xpReward: 250,
        progress: 0,
        isUnlocked: false,
      },
      {
        id: 'streak_7',
        title: '7-Day Pose Streak',
        description: 'Maintain a 7-day capture streak',
        icon: 'flame',
        xpReward: 600,
        progress: 0,
        isUnlocked: false,
      },
      {
        id: 'streak_30',
        title: '30-Day Pose Master',
        description: 'Maintain a 30-day continuous posing streak',
        icon: 'flame',
        xpReward: 2000,
        progress: 0,
        isUnlocked: false,
      },
      {
        id: 'perfect_match_5',
        title: 'Master Alignment',
        description: 'Score 95%+ on 5 different poses',
        icon: 'target',
        xpReward: 500,
        progress: 0,
        isUnlocked: false,
      },
      {
        id: 'template_creator',
        title: 'Template Creator',
        description: 'Create and publish your first custom template',
        icon: 'sparkles',
        xpReward: 300,
        progress: 0,
        isUnlocked: false,
      },
      {
        id: 'remix_master',
        title: 'Remix Master',
        description: 'Create 3 unique variations from existing templates',
        icon: 'refresh',
        xpReward: 400,
        progress: 0,
        isUnlocked: false,
      },
      {
        id: 'pose_explorer',
        title: 'Pose Explorer',
        description: 'Capture photos across 5 different pose categories',
        icon: 'grid',
        xpReward: 400,
        progress: 0,
        isUnlocked: false,
      },
      {
        id: 'signature_pose_master',
        title: 'Signature Pose Master',
        description: 'Achieve ≥90% match on 3 signature poses',
        icon: 'target',
        xpReward: 500,
        progress: 0,
        isUnlocked: false,
      },
      {
        id: 'trendsetter',
        title: 'Trendsetter',
        description: 'Have a template remixed or saved by the community',
        icon: 'sparkles',
        xpReward: 600,
        progress: 0,
        isUnlocked: false,
      },
    ];
  }

  /**
   * Generates a deterministic daily challenge based on today's date YYYY-MM-DD
   */
  static getDailyChallenge(todayDateStr: string = new Date().toISOString().split('T')[0]): DailyChallenge {
    // Generate deterministic index from date string characters
    const hash = todayDateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const poseIndex = hash % SNAP_POSE_DATASET.length;
    const targetPose = SNAP_POSE_DATASET[poseIndex] || SNAP_POSE_DATASET[0];

    return {
      id: `daily_${todayDateStr}`,
      date: todayDateStr,
      title: `Daily Shot: ${targetPose.title}`,
      description: `Hit at least 85% match alignment on the "${targetPose.title}" pose today.`,
      targetPoseId: targetPose.id,
      targetCategory: targetPose.categoryId,
      minScore: 85,
      xpReward: 200,
      isCompleted: false,
    };
  }

  /**
   * Updates streak status given today's date
   */
  static evaluateStreak(profile: GamificationProfile, todayDateStr: string): { newStreak: number; streakIncreased: boolean } {
    if (!profile.lastActiveDate) {
      return { newStreak: 1, streakIncreased: true };
    }
    if (profile.lastActiveDate === todayDateStr) {
      return { newStreak: profile.streakDays, streakIncreased: false };
    }

    const last = new Date(profile.lastActiveDate);
    const today = new Date(todayDateStr);
    const diffDays = Math.round((today.getTime() - last.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 1) {
      return { newStreak: profile.streakDays + 1, streakIncreased: true };
    } else if (diffDays > 1) {
      return { newStreak: 1, streakIncreased: false }; // Streak reset
    }

    return { newStreak: profile.streakDays, streakIncreased: false };
  }
}
