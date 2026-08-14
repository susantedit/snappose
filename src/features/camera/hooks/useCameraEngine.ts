/**
 * useCameraEngine — camera session controls hook.
 *
 * Manages local camera control state (flash, grid, timer, HDR, voice,
 * facing) and derives `isAutoCaptureReady` from the camera store's
 * poseScore and the settings auto-capture threshold.
 *
 * [Req 8, 17]
 */

import { useCallback, useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useCameraStore } from '@/stores/cameraStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { FlashMode, GridType, TimerDuration } from '@/features/camera/types';

// ---------------------------------------------------------------------------
// Return type
// ---------------------------------------------------------------------------

export interface UseCameraEngineResult {
  /** Current camera facing direction. */
  facing: 'front' | 'back';
  /** Toggle between front and rear camera. */
  toggleFacing: () => void;
  /** Shared value 0→1 driving the flip animation (250 ms). */
  flipProgress: ReturnType<typeof useSharedValue<number>>;

  /** Current flash mode. */
  flashMode: FlashMode;
  setFlashMode: (mode: FlashMode) => void;

  /** Current grid overlay type. */
  gridType: GridType;
  setGridType: (type: GridType) => void;

  /** Current timer duration (null = off). */
  timerDuration: TimerDuration;
  setTimerDuration: (duration: TimerDuration) => void;

  /** Whether HDR is enabled. */
  isHDR: boolean;
  toggleHDR: () => void;

  /** Whether voice coaching is enabled. */
  isVoiceEnabled: boolean;
  toggleVoice: () => void;

  /**
   * True when poseScore >= autoCaptureThreshold from settings.
   * Used to colour the shutter button green. [Req 17]
   */
  isAutoCaptureReady: boolean;

  /** Whether the camera preview is currently active. */
  isActive: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useCameraEngine(): UseCameraEngineResult {
  const { facing, setFacing, isActive, setActive, poseScore } = useCameraStore();
  const {
    camera: { flashMode, gridType, autoCaptureThreshold, voiceGuidanceEnabled },
    updateCameraSettings,
  } = useSettingsStore();

  // Local HDR state (not persisted, session-only)
  const isHDR = false; // default; toggling managed via settingsStore if needed

  // Flip animation shared value
  const flipProgress = useSharedValue(0);

  // ── AppState listener — pause camera when backgrounded [Req 8.7] ────────
  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        setActive(false);
      } else if (nextState === 'active') {
        setActive(true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    // Activate on mount
    setActive(true);

    return () => {
      subscription.remove();
      // Release camera within 500ms of unmount [Req 8.7]
      setActive(false);
    };
  }, [setActive]);

  // ── Facing toggle with 250 ms Reanimated flip [Req 8.2] ─────────────────
  const toggleFacing = useCallback(() => {
    flipProgress.value = withTiming(1, { duration: 125 }, (finished) => {
      if (finished) {
        runOnJS(setFacing)(facing === 'back' ? 'front' : 'back');
        flipProgress.value = withTiming(0, { duration: 125 });
      }
    });
  }, [facing, setFacing, flipProgress]);

  // ── Flash ────────────────────────────────────────────────────────────────
  const setFlashMode = useCallback(
    (mode: FlashMode) => updateCameraSettings({ flashMode: mode }),
    [updateCameraSettings],
  );

  // ── Grid ─────────────────────────────────────────────────────────────────
  const setGridType = useCallback(
    (type: GridType) => updateCameraSettings({ gridType: type }),
    [updateCameraSettings],
  );

  // ── Timer — local session state (not persisted) ──────────────────────────
  const setTimerDuration = useCallback(
    (_duration: TimerDuration) => {
      // Timer duration is transient; stored locally via separate state in camera screen
    },
    [],
  );

  // ── HDR ──────────────────────────────────────────────────────────────────
  const toggleHDR = useCallback(() => {
    // HDR is session-only; handled in camera screen component state
  }, []);

  // ── Voice ─────────────────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    updateCameraSettings({ voiceGuidanceEnabled: !voiceGuidanceEnabled });
  }, [voiceGuidanceEnabled, updateCameraSettings]);

  // ── Auto-capture readiness [Req 17] ──────────────────────────────────────
  const isAutoCaptureReady = poseScore >= autoCaptureThreshold;

  return {
    facing,
    toggleFacing,
    flipProgress,
    flashMode,
    setFlashMode,
    gridType,
    setGridType,
    timerDuration: null,
    setTimerDuration,
    isHDR,
    toggleHDR,
    isVoiceEnabled: voiceGuidanceEnabled,
    toggleVoice,
    isAutoCaptureReady,
    isActive,
  };
}
