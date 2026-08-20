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

export function isNativeDetectorAvailable(): boolean {
  try {
    return Boolean(ExpoPoseDetector && ExpoPoseDetector.isAvailable?.());
  } catch {
    return false;
  }
}

export function startNativePoseDetection(): boolean {
  try {
    return Boolean(ExpoPoseDetector?.startDetection?.());
  } catch {
    return false;
  }
}

export function stopNativePoseDetection(): boolean {
  try {
    return Boolean(ExpoPoseDetector?.stopDetection?.());
  } catch {
    return false;
  }
}

export function addPoseDetectedListener(listener: (event: NativePoseResult) => void) {
  if (!emitter) return { remove: () => {} };
  return emitter.addListener('onPoseDetected', listener);
}
