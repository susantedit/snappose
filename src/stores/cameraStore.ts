/**
 * Zustand cameraStore — transient camera session state (no persistence).
 * [Req 8]
 */

import { create } from 'zustand';
import type { DistanceState } from '@/features/camera/types';
import type { OverlayTransform } from '@/features/camera/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CameraState {
  /** Whether the camera preview is currently active. */
  isActive: boolean;
  /** The pose ID loaded into the camera (null when none). */
  currentPoseId: string | null;
  /** Current gesture transform for the overlay. */
  overlayTransform: OverlayTransform;
  /** Live pose similarity score 0–100. */
  poseScore: number;
  /** Auto-capture countdown (3 → 2 → 1), null when not counting. */
  autoCaptureCountdown: number | null;
  /** Lighting quality 0–100. */
  lightingScore: number;
  /** Distance estimation state. */
  distanceState: DistanceState;
  /** Whether the overlay is gesture-locked. */
  isOverlayLocked: boolean;
  /** Active camera facing direction. */
  facing: 'front' | 'back';

  // Actions
  setActive: (active: boolean) => void;
  setCurrentPoseId: (poseId: string | null) => void;
  setOverlayTransform: (transform: OverlayTransform) => void;
  setPoseScore: (score: number) => void;
  setAutoCaptureCountdown: (countdown: number | null) => void;
  setLightingScore: (score: number) => void;
  setDistanceState: (state: DistanceState) => void;
  setOverlayLocked: (locked: boolean) => void;
  setFacing: (facing: 'front' | 'back') => void;
  reset: () => void;
}

// ---------------------------------------------------------------------------
// Default overlay transform
// ---------------------------------------------------------------------------

const DEFAULT_OVERLAY_TRANSFORM: OverlayTransform = {
  x: 0,
  y: 0,
  scale: 1,
  rotation: 0,
  opacity: 55,
  locked: false,
  mirrored: false,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useCameraStore = create<CameraState>((set) => ({
  isActive: false,
  currentPoseId: null,
  overlayTransform: DEFAULT_OVERLAY_TRANSFORM,
  poseScore: 0,
  autoCaptureCountdown: null,
  lightingScore: 50,
  distanceState: 'good',
  isOverlayLocked: false,
  facing: 'back',

  setActive: (active) => set({ isActive: active }),
  setCurrentPoseId: (poseId) => set({ currentPoseId: poseId }),
  setOverlayTransform: (transform) => set({ overlayTransform: transform }),
  setPoseScore: (score) => set({ poseScore: score }),
  setAutoCaptureCountdown: (countdown) => set({ autoCaptureCountdown: countdown }),
  setLightingScore: (score) => set({ lightingScore: score }),
  setDistanceState: (state) => set({ distanceState: state }),
  setOverlayLocked: (locked) => set({ isOverlayLocked: locked }),
  setFacing: (facing) => set({ facing }),
  reset: () =>
    set({
      isActive: false,
      currentPoseId: null,
      overlayTransform: DEFAULT_OVERLAY_TRANSFORM,
      poseScore: 0,
      autoCaptureCountdown: null,
      lightingScore: 50,
      distanceState: 'good',
      isOverlayLocked: false,
      facing: 'back',
    }),
}));
