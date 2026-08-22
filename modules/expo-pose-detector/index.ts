/**
 * expo-pose-detector — POSEHANUM Native Module JS Interface
 *
 * Provides JS-side access to the native CameraX + MediaPipe pose detection pipeline.
 *
 * RUNTIME REQUIREMENTS:
 *  - Custom native build required (npx expo run:android / eas build)
 *  - MediaPipe model asset: pose_landmarker_full.task
 *    Download from:
 *    https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task
 *    Place at: android/app/src/main/assets/pose_landmarker_full.task
 *
 * In Expo Go (JS-only sandbox): all functions safely no-op and isNativeDetectorAvailable() returns false.
 */

import { NativeModules, NativeEventEmitter } from 'react-native';
import type { LandmarkSet } from '../../src/features/ai/types';
import type { AiDetectionStatus } from '../../src/features/ai/domain/types';

export interface NativePoseResult {
  status: AiDetectionStatus;
  personCount: number;
  inferenceMs: number;
  landmarks: LandmarkSet | null;
}

const { ExpoPoseDetector } = NativeModules;

const emitter = ExpoPoseDetector ? new NativeEventEmitter(ExpoPoseDetector) : null;

/**
 * Returns true if the native MediaPipe module is compiled into this build.
 * Returns false in Expo Go (managed JS sandbox) where native modules cannot run.
 */
export function isNativeDetectorAvailable(): boolean {
  try {
    return Boolean(ExpoPoseDetector && ExpoPoseDetector.isAvailable?.());
  } catch {
    return false;
  }
}

/**
 * Starts native CameraX camera frame capture and MediaPipe pose inference.
 * Frames are processed at approximately 30 FPS on the native analysis thread.
 * Results are delivered via the onPoseDetected event (addPoseDetectedListener).
 *
 * @returns true if detection started, false if native module unavailable
 */
export function startNativePoseDetection(): boolean {
  try {
    return Boolean(ExpoPoseDetector?.startDetection?.());
  } catch {
    return false;
  }
}

/**
 * Stops CameraX frame capture and MediaPipe inference.
 * Releases all native resources. Safe to call multiple times.
 *
 * @returns true if successfully stopped
 */
export function stopNativePoseDetection(): boolean {
  try {
    return Boolean(ExpoPoseDetector?.stopDetection?.());
  } catch {
    return false;
  }
}

/**
 * Flips between front (selfie) and back camera while detection is running.
 * Front-camera landmarks are automatically mirrored in the native layer so
 * left/right body parts are correct from the user's perspective.
 *
 * @returns true if flip was initiated
 */
export function flipNativeCamera(): boolean {
  try {
    return Boolean(ExpoPoseDetector?.flipCamera?.());
  } catch {
    return false;
  }
}

/**
 * Subscribes to native pose detection events.
 * The listener is called for every processed frame (~30 FPS when a person is detected).
 *
 * @param listener Callback receiving NativePoseResult with landmarks or NO_PERSON status
 * @returns Subscription object with a remove() method for cleanup
 */
export function addPoseDetectedListener(
  listener: (event: NativePoseResult) => void,
): { remove: () => void } {
  if (!emitter) return { remove: () => {} };
  return emitter.addListener('onPoseDetected', listener);
}

/**
 * Subscribes to native pose detection error events.
 * Fires when MediaPipe fails to initialize or encounters a fatal inference error.
 *
 * @param listener Callback receiving { error: string }
 * @returns Subscription object with a remove() method for cleanup
 */
export function addPoseErrorListener(
  listener: (event: { error: string }) => void,
): { remove: () => void } {
  if (!emitter) return { remove: () => {} };
  return emitter.addListener('onError', listener);
}
