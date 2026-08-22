/**
 * OnboardingChecklistStore — Persistent Onboarding Aha-Moment Progression.
 *
 * Tracks the 5 key high-value product actions for new users:
 *  1. Explore Pose Library
 *  2. Open Camera & Experience AI Director Guidance
 *  3. Capture First AI-Verified Photo
 *  4. Design a Creative Template in Canvas Editor
 *  5. Save a Signature Pose to Favorites
 *
 * Persisted in MMKV storage across sessions.
 */

import { create } from 'zustand';
import { mmkv } from '@/database/mmkv/mmkvClient';

const CHECKLIST_STORAGE_KEY = 'snappose_onboarding_checklist_v1';

export type OnboardingStepId =
  | 'explore_poses'
  | 'try_camera_director'
  | 'capture_first_photo'
  | 'create_template'
  | 'save_favorite';

export interface OnboardingStep {
  id: OnboardingStepId;
  title: string;
  description: string;
  route: string;
  icon: string;
  isCompleted: boolean;
}

interface OnboardingChecklistState {
  steps: Record<OnboardingStepId, boolean>;
  isCollapsed: boolean;
  isDismissed: boolean;
  markCompleted: (stepId: OnboardingStepId) => void;
  toggleCollapsed: () => void;
  dismiss: () => void;
  reset: () => void;
  getCompletedCount: () => number;
  getTotalCount: () => number;
  isAllCompleted: () => boolean;
}

const DEFAULT_STEPS: Record<OnboardingStepId, boolean> = {
  explore_poses: false,
  try_camera_director: false,
  capture_first_photo: false,
  create_template: false,
  save_favorite: false,
};

function loadPersistedState(): {
  steps: Record<OnboardingStepId, boolean>;
  isCollapsed: boolean;
  isDismissed: boolean;
} {
  try {
    const raw = mmkv.getString(CHECKLIST_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return {
    steps: { ...DEFAULT_STEPS },
    isCollapsed: true,
    isDismissed: false,
  };
}

function persistState(state: {
  steps: Record<OnboardingStepId, boolean>;
  isCollapsed: boolean;
  isDismissed: boolean;
}): void {
  try {
    mmkv.set(CHECKLIST_STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const initial = loadPersistedState();

export const useOnboardingChecklistStore = create<OnboardingChecklistState>((set, get) => ({
  steps: initial.steps,
  isCollapsed: initial.isCollapsed,
  isDismissed: initial.isDismissed,

  markCompleted: (stepId: OnboardingStepId) => {
    const currentSteps = get().steps;
    if (currentSteps[stepId]) return; // already completed

    const updatedSteps = { ...currentSteps, [stepId]: true };
    set({ steps: updatedSteps });
    persistState({
      steps: updatedSteps,
      isCollapsed: get().isCollapsed,
      isDismissed: get().isDismissed,
    });
  },

  toggleCollapsed: () => {
    const nextCollapsed = !get().isCollapsed;
    set({ isCollapsed: nextCollapsed });
    persistState({
      steps: get().steps,
      isCollapsed: nextCollapsed,
      isDismissed: get().isDismissed,
    });
  },

  dismiss: () => {
    set({ isDismissed: true });
    persistState({
      steps: get().steps,
      isCollapsed: get().isCollapsed,
      isDismissed: true,
    });
  },

  reset: () => {
    const fresh = {
      steps: { ...DEFAULT_STEPS },
      isCollapsed: false,
      isDismissed: false,
    };
    set(fresh);
    persistState(fresh);
  },

  getCompletedCount: () => {
    const steps = get().steps;
    return Object.values(steps).filter(Boolean).length;
  },

  getTotalCount: () => 5,

  isAllCompleted: () => {
    const steps = get().steps;
    return Object.values(steps).every(Boolean);
  },
}));

export const ONBOARDING_STEP_DEFS: Array<{
  id: OnboardingStepId;
  title: string;
  description: string;
  route: string;
  icon: string;
}> = [
  {
    id: 'explore_poses',
    title: 'Explore Pose References',
    description: 'Find inspiration from 259+ curated pose ideas and Shot Recipes.',
    route: '/(tabs)/search',
    icon: 'search',
  },
  {
    id: 'try_camera_director',
    title: 'Experience AI Director Guidance',
    description: 'Open camera with AR skeleton alignment & live voice coaching.',
    route: '/(tabs)/camera',
    icon: 'camera',
  },
  {
    id: 'capture_first_photo',
    title: 'Capture AI-Verified Photo',
    description: 'Lock your pose angle to achieve high precision match score.',
    route: '/(tabs)/camera',
    icon: 'checkCircle',
  },
  {
    id: 'create_template',
    title: 'Design Creative Template',
    description: 'Add custom text captions, stickers, and layout in the Canvas Studio.',
    route: '/template-creator',
    icon: 'sparkles',
  },
  {
    id: 'save_favorite',
    title: 'Save a Signature Pose',
    description: 'Tap the heart on any pose to save it to your offline favorites.',
    route: '/(tabs)/favorites',
    icon: 'heart',
  },
];
