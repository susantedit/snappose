/**
 * gamificationStore — Zustand Store with MMKV persistence for XP, Level, Streaks, and Achievements.
 */

import { create } from 'zustand';
import { mmkv } from '@/database/mmkv/mmkvClient';
import type { GamificationProfile, Achievement, DailyChallenge } from '@/features/gamification/types';
import { GamificationEngine } from '@/features/gamification/domain/GamificationEngine';

const STORAGE_KEY = 'snappose_gamification_profile_v1';

interface GamificationState {
  profile: GamificationProfile;
  achievements: Achievement[];
  dailyChallenge: DailyChallenge;

  // Actions
  recordCapture: (score: number, poseId: string, categoryId: string) => { xpGained: number; leveledUp: boolean };
  completeDailyChallenge: () => void;
  unlockAchievement: (achievementId: string) => void;
  resetGamification: () => void;
}

function loadProfile(): GamificationProfile {
  try {
    const raw = mmkv.getString(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    xp: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: '',
    completedChallengeIds: [],
    unlockedAchievementIds: [],
    totalCaptures: 0,
    perfectMatches: 0,
  };
}

function persistProfile(profile: GamificationProfile) {
  try {
    mmkv.set(STORAGE_KEY, JSON.stringify(profile));
  } catch {}
}

export const useGamificationStore = create<GamificationState>((set, get) => {
  const initialProfile = loadProfile();
  const todayStr = new Date().toISOString().split('T')[0];
  const initialChallenge = GamificationEngine.getDailyChallenge(todayStr);
  initialChallenge.isCompleted = initialProfile.completedChallengeIds.includes(initialChallenge.id);

  const initialAchievements = GamificationEngine.getStandardAchievements().map((ach) => ({
    ...ach,
    isUnlocked: initialProfile.unlockedAchievementIds.includes(ach.id),
  }));

  return {
    profile: initialProfile,
    achievements: initialAchievements,
    dailyChallenge: initialChallenge,

    recordCapture: (score: number, poseId: string, categoryId: string) => {
      const { profile, dailyChallenge, completeDailyChallenge } = get();
      const today = new Date().toISOString().split('T')[0];
      const { newStreak } = GamificationEngine.evaluateStreak(profile, today);

      let xpGained = 50; // Base capture XP
      if (score >= 95) xpGained += 50;
      else if (score >= 85) xpGained += 25;

      const newXP = profile.xp + xpGained;
      const newLevel = GamificationEngine.getLevelFromXP(newXP);
      const leveledUp = newLevel > profile.level;

      const updatedProfile: GamificationProfile = {
        ...profile,
        xp: newXP,
        level: newLevel,
        streakDays: newStreak,
        lastActiveDate: today,
        totalCaptures: profile.totalCaptures + 1,
        perfectMatches: score >= 95 ? profile.perfectMatches + 1 : profile.perfectMatches,
      };

      persistProfile(updatedProfile);
      set({ profile: updatedProfile });

      // Check daily challenge completion
      if (
        !dailyChallenge.isCompleted &&
        (dailyChallenge.targetPoseId === poseId || dailyChallenge.targetCategory === categoryId) &&
        score >= dailyChallenge.minScore
      ) {
        completeDailyChallenge();
      }

      return { xpGained, leveledUp };
    },

    completeDailyChallenge: () => {
      const { profile, dailyChallenge } = get();
      if (dailyChallenge.isCompleted) return;

      const newXP = profile.xp + dailyChallenge.xpReward;
      const newLevel = GamificationEngine.getLevelFromXP(newXP);

      const updatedProfile: GamificationProfile = {
        ...profile,
        xp: newXP,
        level: newLevel,
        completedChallengeIds: [...profile.completedChallengeIds, dailyChallenge.id],
      };

      persistProfile(updatedProfile);
      set({
        profile: updatedProfile,
        dailyChallenge: { ...dailyChallenge, isCompleted: true },
      });
    },

    unlockAchievement: (achievementId: string) => {
      const { profile, achievements } = get();
      if (profile.unlockedAchievementIds.includes(achievementId)) return;

      const target = achievements.find((a) => a.id === achievementId);
      const reward = target ? target.xpReward : 100;
      const newXP = profile.xp + reward;
      const newLevel = GamificationEngine.getLevelFromXP(newXP);

      const updatedProfile: GamificationProfile = {
        ...profile,
        xp: newXP,
        level: newLevel,
        unlockedAchievementIds: [...profile.unlockedAchievementIds, achievementId],
      };

      persistProfile(updatedProfile);
      set({
        profile: updatedProfile,
        achievements: achievements.map((a) =>
          a.id === achievementId ? { ...a, isUnlocked: true, unlockedAt: new Date().toISOString() } : a
        ),
      });
    },

    resetGamification: () => {
      const fresh: GamificationProfile = {
        xp: 0,
        level: 1,
        streakDays: 0,
        lastActiveDate: '',
        completedChallengeIds: [],
        unlockedAchievementIds: [],
        totalCaptures: 0,
        perfectMatches: 0,
      };
      persistProfile(fresh);
      set({ profile: fresh });
    },
  };
});
