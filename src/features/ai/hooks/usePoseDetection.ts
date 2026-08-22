import { useEffect, useRef, useState, useCallback } from 'react';
import { MediaPipePoseDetector } from '../infrastructure/MediaPipePoseDetector';
import type { CameraFrame, LandmarkSet } from '../types';
import type { AiDetectionStatus } from '../domain/types';
import {
  isNativeDetectorAvailable,
  startNativePoseDetection,
  stopNativePoseDetection,
  addPoseDetectedListener,
  addPoseErrorListener,
  type NativePoseResult,
} from '../../../../modules/expo-pose-detector';

export interface UsePoseDetectionOptions {
  autoInit?: boolean;
}

export function usePoseDetection({
  autoInit = true,
}: UsePoseDetectionOptions = {}) {
  const detectorRef = useRef<MediaPipePoseDetector | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isNativeAvailable, setIsNativeAvailable] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<AiDetectionStatus>('UNINITIALISED');
  const [lastLandmarks, setLastLandmarks] = useState<LandmarkSet | null>(null);
  const [inferenceTimeMs, setInferenceTimeMs] = useState(0);
  const [nativeError, setNativeError] = useState<string | null>(null);

  // Frame detection — consumes real native frame landmarks delivered via NativeEventEmitter
  const detect = useCallback(async (frame?: CameraFrame): Promise<LandmarkSet | null> => {
    if (!detectorRef.current || !isReady) {
      setDetectionStatus('UNINITIALISED');
      return null;
    }
    const outcome = await detectorRef.current.detectDetailed(frame);
    setDetectionStatus(outcome.status);
    setInferenceTimeMs(outcome.inferenceMs);
    setLastLandmarks(outcome.landmarks);
    return outcome.landmarks;
  }, [isReady]);

  useEffect(() => {
    if (!autoInit) return;

    const detector = new MediaPipePoseDetector();
    detectorRef.current = detector;
    const nativeAvail = isNativeDetectorAvailable();
    setIsNativeAvailable(nativeAvail);

    let mounted = true;
    let poseListenerSub: { remove: () => void } | null = null;
    let errorListenerSub: { remove: () => void } | null = null;

    detector.initialise().then(() => {
      if (!mounted) return;
      setIsReady(true);
      setDetectionStatus('NO_PERSON');

      if (nativeAvail) {
        // Start the CameraX → MediaPipe native inference pipeline
        startNativePoseDetection();

        // Subscribe to landmark events emitted at ~30 FPS from the native layer
        poseListenerSub = addPoseDetectedListener((event: NativePoseResult) => {
          if (!mounted) return;
          if (event.landmarks && event.landmarks.length > 0) {
            // Forward real native landmarks through the JS MediaPipe processor
            // (applies temporal filter and visibility checks)
            detect({ landmarks: event.landmarks as any, personCount: event.personCount });
          } else {
            // No landmarks in this frame (person left frame or not detected)
            setDetectionStatus((event.status as AiDetectionStatus) ?? 'NO_PERSON');
            setLastLandmarks(null);
            setInferenceTimeMs(event.inferenceMs ?? 0);
          }
        });

        // Subscribe to native error events (MediaPipe initialization failure etc.)
        errorListenerSub = addPoseErrorListener((event: { error: string }) => {
          if (!mounted) return;
          console.warn('[usePoseDetection] Native error:', event.error);
          setNativeError(event.error);
          setDetectionStatus('FAILED');
        });
      }
    });

    return () => {
      mounted = false;

      if (nativeAvail) {
        // Stop the CameraX frame capture and MediaPipe inference
        stopNativePoseDetection();
      }

      // Remove event subscriptions to prevent memory leaks
      poseListenerSub?.remove();
      errorListenerSub?.remove();

      detector.destroy();
      detectorRef.current = null;
      setIsReady(false);
      setDetectionStatus('UNINITIALISED');
    };
  // detect is intentionally excluded from deps — it's memoized and stable after isReady=true
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoInit]);

  return {
    isReady,
    isNativeAvailable,
    detectionStatus,
    detect,
    lastLandmarks,
    inferenceTimeMs,
    nativeError,
  };
}
