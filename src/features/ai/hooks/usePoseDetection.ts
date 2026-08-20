import { useEffect, useRef, useState, useCallback } from 'react';
import { MediaPipePoseDetector } from '../infrastructure/MediaPipePoseDetector';
import type { CameraFrame, LandmarkSet } from '../types';
import type { AiDetectionStatus } from '../domain/types';

export interface UsePoseDetectionOptions {
  autoInit?: boolean;
}

export function usePoseDetection({
  autoInit = true,
}: UsePoseDetectionOptions = {}) {
  const detectorRef = useRef<MediaPipePoseDetector | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [detectionStatus, setDetectionStatus] = useState<AiDetectionStatus>('UNINITIALISED');
  const [lastLandmarks, setLastLandmarks] = useState<LandmarkSet | null>(null);
  const [inferenceTimeMs, setInferenceTimeMs] = useState(0);

  useEffect(() => {
    if (!autoInit) return;

    const detector = new MediaPipePoseDetector();
    detectorRef.current = detector;

    let mounted = true;
    detector.initialise().then(() => {
      if (mounted) {
        setIsReady(true);
        setDetectionStatus('NO_PERSON');
      }
    });

    return () => {
      mounted = false;
      detector.destroy();
      detectorRef.current = null;
      setIsReady(false);
      setDetectionStatus('UNINITIALISED');
    };
  }, [autoInit]);

  // Frame detection — consumes real native frame buffer
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

  return {
    isReady,
    detectionStatus,
    detect,
    lastLandmarks,
    inferenceTimeMs,
  };
}

