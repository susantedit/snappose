/**
 * personalizationStore — Zustand Store for Privacy-First Personalization & Recommendation Engine.
 *
 * Manages user preference vectors, interaction signal ingestion, explicit feedback,
 * and candidate recommendation generation with synchronous MMKV caching.
 */

import { create } from 'zustand';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';
import type { Pose } from '@/features/poses/types';
import { SNAP_POSE_DATASET } from '@/features/poses/data/posesData';
import {
  type ColdStartAnswers,
  ColdStartService,
  BehaviorTracker,
  PersonalizationEngine,
  type ExplicitFeedbackItem,
  type InteractionSignal,
  type InteractionSignalType,
  type OutfitCategory,
  type RecommendationContext,
  type ScoredRecommendation,
  type UserPreferenceProfile,
} from '@/features/personalization';

interface PersonalizationState {
  profile: UserPreferenceProfile;
  isPersonalizationEnabled: boolean;
  outfitPreference: OutfitCategory | undefined;
  explicitFeedback: ExplicitFeedbackItem[];
  sessionSignals: InteractionSignal[];

  // Actions
  recordSignal: (
    signal: Omit<InteractionSignal, 'id' | 'timestamp'>,
    targetPose?: Pose,
  ) => void;
  recordExplicitFeedback: (
    poseId: string,
    action: 'like' | 'dislike' | 'more_like_this' | 'dont_recommend',
  ) => void;
  getRecommendedPoses: (
    candidatePoses?: Pose[],
    context?: RecommendationContext,
    limit?: number,
  ) => ScoredRecommendation[];
  setPersonalizationEnabled: (enabled: boolean) => void;
  resetProfile: () => void;
  setOutfitPreference: (outfit: OutfitCategory | undefined) => void;
  updateSurveyPreferences: (answers: ColdStartAnswers) => void;
}

const engine = new PersonalizationEngine();

function loadInitialProfile(): UserPreferenceProfile {
  try {
    const raw = mmkv.getString(MMKV_KEYS.USER_PREFERENCE_PROFILE);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return ColdStartService.createDefaultProfile();
}

function loadInitialFeedback(): ExplicitFeedbackItem[] {
  try {
    const raw = mmkv.getString(MMKV_KEYS.EXPLICIT_FEEDBACK);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

export const usePersonalizationStore = create<PersonalizationState>((set, get) => ({
  profile: loadInitialProfile(),
  isPersonalizationEnabled: mmkv.getBoolean(MMKV_KEYS.PERSONALIZATION_ENABLED) ?? true,
  outfitPreference: (mmkv.getString(MMKV_KEYS.OUTFIT_PREFERENCE) as OutfitCategory) || undefined,
  explicitFeedback: loadInitialFeedback(),
  sessionSignals: [],

  recordSignal: (signalInput, targetPose) => {
    const { isPersonalizationEnabled, profile, sessionSignals } = get();

    const signal: InteractionSignal = {
      ...signalInput,
      id: `sig-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
    };

    const nextSessionSignals = [signal, ...sessionSignals].slice(0, 50);

    if (!isPersonalizationEnabled) {
      set({ sessionSignals: nextSessionSignals });
      return;
    }

    // Resolve target pose if poseId provided and targetPose not passed
    const resolvedPose =
      targetPose ||
      (signal.poseId ? SNAP_POSE_DATASET.find((p) => p.id === signal.poseId) : undefined);

    const updatedProfile = BehaviorTracker.updateProfileWithSignal(
      profile,
      signal,
      resolvedPose,
    );

    try {
      mmkv.set(MMKV_KEYS.USER_PREFERENCE_PROFILE, JSON.stringify(updatedProfile));
    } catch {}

    set({
      profile: updatedProfile,
      sessionSignals: nextSessionSignals,
    });
  },

  recordExplicitFeedback: (poseId, action) => {
    const { explicitFeedback, recordSignal } = get();
    const item: ExplicitFeedbackItem = {
      poseId,
      action,
      timestamp: new Date().toISOString(),
    };

    const updatedFeedback = [item, ...explicitFeedback.filter((f) => f.poseId !== poseId)].slice(
      0,
      100,
    );

    try {
      mmkv.set(MMKV_KEYS.EXPLICIT_FEEDBACK, JSON.stringify(updatedFeedback));
    } catch {}

    set({ explicitFeedback: updatedFeedback });

    // Map to Interaction Signal
    let signalType: InteractionSignalType = 'EXPLICIT_LIKE';
    if (action === 'dislike') signalType = 'EXPLICIT_DISLIKE';
    if (action === 'more_like_this') signalType = 'FEEDBACK_MORE_LIKE_THIS';
    if (action === 'dont_recommend') signalType = 'FEEDBACK_DONT_RECOMMEND';

    recordSignal({
      type: signalType,
      poseId,
    });
  },

  getRecommendedPoses: (candidatePoses = SNAP_POSE_DATASET, context, limit = 8) => {
    const { isPersonalizationEnabled, profile, explicitFeedback, sessionSignals } = get();

    // Filter out explicitly disliked or 'dont_recommend' poses
    const blockedIds = new Set(
      explicitFeedback
        .filter((f) => f.action === 'dislike' || f.action === 'dont_recommend')
        .map((f) => f.poseId),
    );

    const availablePoses = candidatePoses.filter((p) => !blockedIds.has(p.id));

    if (!isPersonalizationEnabled) {
      // Return neutral trending poses when disabled
      return availablePoses.slice(0, limit).map((pose) => ({
        pose,
        totalScore: 0.5,
        explanation: 'Popular in POSEHANUM',
        isExploration: false,
        scoreBreakdown: {
          category: 0.5,
          poseType: 0.5,
          cameraAngle: 0.5,
          historicalSuccess: 0.5,
          matchScore: 0.5,
          recentInterest: 0.5,
          context: 0.5,
          novelty: 0.5,
        },
      }));
    }

    const interactedPoseIds = new Set(
      sessionSignals.filter((s) => s.poseId).map((s) => s.poseId as string),
    );

    return engine.rankPoses(availablePoses, profile, context, limit, interactedPoseIds);
  },

  setPersonalizationEnabled: (enabled: boolean) => {
    try {
      mmkv.set(MMKV_KEYS.PERSONALIZATION_ENABLED, enabled);
    } catch {}
    set({ isPersonalizationEnabled: enabled });
  },

  resetProfile: () => {
    const freshProfile = ColdStartService.createDefaultProfile();
    try {
      mmkv.set(MMKV_KEYS.USER_PREFERENCE_PROFILE, JSON.stringify(freshProfile));
      mmkv.delete(MMKV_KEYS.EXPLICIT_FEEDBACK);
    } catch {}
    set({
      profile: freshProfile,
      explicitFeedback: [],
      sessionSignals: [],
    });
  },

  setOutfitPreference: (outfit: OutfitCategory | undefined) => {
    try {
      if (outfit) {
        mmkv.set(MMKV_KEYS.OUTFIT_PREFERENCE, outfit);
      } else {
        mmkv.delete(MMKV_KEYS.OUTFIT_PREFERENCE);
      }
    } catch {}
    set({ outfitPreference: outfit });
  },

  updateSurveyPreferences: (answers: ColdStartAnswers) => {
    const customizedProfile = ColdStartService.createProfileFromAnswers(answers);
    try {
      mmkv.set(MMKV_KEYS.USER_PREFERENCE_PROFILE, JSON.stringify(customizedProfile));
    } catch {}
    set({ profile: customizedProfile });
  },
}));
