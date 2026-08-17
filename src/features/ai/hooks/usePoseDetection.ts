/**
 * usePoseDetection — React hook managing on-device MediaPipe pose detector lifecycle & live tracking.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { MediaPipePoseDetector } from '../infrastructure/MediaPipePoseDetector';
import type { CameraFrame, LandmarkSet } from '../types';

export interface UsePoseDetectionOptions {
  autoInit?: boolean;
  streaming?: boolean;
  targetFps?: number;
}

export function usePoseDetection({
  autoInit = true,
  streaming = true,
  targetFps = 30,
}: UsePoseDetectionOptions = {}) {
  const detectorRef = useRef<MediaPipePoseDetector | null>(null);
  const [isReady, setIsReady] = useState(false);
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
      }
    });

    return () => {
      mounted = false;
      detector.destroy();
      detectorRef.current = null;
      setIsReady(false);
    };
  }, [autoInit]);

  // Single frame detection
  const detect = useCallback(async (frame?: CameraFrame): Promise<LandmarkSet | null> => {
    if (!detectorRef.current || !isReady) return null;
    const start = Date.now();
    const result = await detectorRef.current.detect(frame);
    const elapsed = Date.now() - start;
    setInferenceTimeMs(elapsed);
    if (result) {
      setLastLandmarks(result);
    }
    return result;
  }, [isReady]);

  // Continuous frame streaming
  useEffect(() => {
    if (!isReady || !streaming) return;

    let active = true;
    const frameIntervalMs = Math.round(1000 / targetFps);

    const interval = setInterval(async () => {
      if (!active || !detectorRef.current) return;
      const result = await detectorRef.current.detect();
      if (active && result) {
        setLastLandmarks(result);
      }
    }, frameIntervalMs);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [isReady, streaming, targetFps]);

  return {
    isReady,
    detect,
    lastLandmarks,
    inferenceTimeMs,
  };
}
