/**
 * CustomPoseStore — Local store for user-uploaded custom poses.
 * Allows users to upload their own reference photos, extract skeletons,
 * and use them directly in the camera viewfinder with full transform adjustments.
 */

import { create } from 'zustand';
import { mmkv } from '@/database/mmkv/mmkvClient';
import type { NormalisedLandmarks } from '@/features/ai/types';
import type { OverlayTransform } from '@/features/camera/types';

export interface CustomPose {
  id: string;
  title: string;
  imageUri: string;
  thumbnailUri?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  landmarks?: NormalisedLandmarks;
  overlayTransform?: OverlayTransform;
  estimatedDistance?: number;
  cameraAngle?: string;
  lighting?: string;
  createdAt: number;
}

interface CustomPoseState {
  customPoses: CustomPose[];
  activeCustomPoseId: string | null;
  addCustomPose: (pose: Omit<CustomPose, 'id' | 'createdAt'>) => CustomPose;
  updateCustomPose: (id: string, updates: Partial<CustomPose>) => void;
  removeCustomPose: (id: string) => void;
  clearAllCustomPoses: () => void;
  setActiveCustomPoseId: (id: string | null) => void;
}

const STORAGE_KEY = 'snappose_custom_poses_v1';

function loadPersistedCustomPoses(): CustomPose[] {
  try {
    const raw = mmkv.getString(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[CustomPoseStore] Failed to load custom poses:', err);
  }
  return [];
}

function persistCustomPoses(poses: CustomPose[]): void {
  try {
    mmkv.set(STORAGE_KEY, JSON.stringify(poses));
  } catch (err) {
    console.warn('[CustomPoseStore] Failed to persist custom poses:', err);
  }
}

export const useCustomPoseStore = create<CustomPoseState>((set, get) => ({
  customPoses: loadPersistedCustomPoses(),
  activeCustomPoseId: null,

  addCustomPose: (poseData) => {
    const newPose: CustomPose = {
      ...poseData,
      id: `custom-pose-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: Date.now(),
    };
    const next = [newPose, ...get().customPoses];
    persistCustomPoses(next);
    set({ customPoses: next, activeCustomPoseId: newPose.id });
    return newPose;
  },

  updateCustomPose: (id, updates) => {
    const next = get().customPoses.map((p) => (p.id === id ? { ...p, ...updates } : p));
    persistCustomPoses(next);
    set({ customPoses: next });
  },

  removeCustomPose: (id) => {
    const next = get().customPoses.filter((p) => p.id !== id);
    persistCustomPoses(next);
    set({
      customPoses: next,
      activeCustomPoseId: get().activeCustomPoseId === id ? null : get().activeCustomPoseId,
    });
  },

  clearAllCustomPoses: () => {
    persistCustomPoses([]);
    set({ customPoses: [], activeCustomPoseId: null });
  },

  setActiveCustomPoseId: (id) => {
    set({ activeCustomPoseId: id });
  },
}));
