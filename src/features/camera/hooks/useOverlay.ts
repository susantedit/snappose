/**
 * useOverlay — React hook managing gesture transforms (scale, pan, rotate, opacity, mirror, lock).
 */

import { useState, useCallback } from 'react';
import {
  DEFAULT_OVERLAY_TRANSFORM,
  applyPan,
  applyPinch,
  applyRotation,
  applyOpacity,
  applyMirror,
  resetTransform,
  toggleLock,
} from '../domain/OverlayTransformEngine';
import type { OverlayTransform } from '../types';

export function useOverlay(initialTransform: OverlayTransform = DEFAULT_OVERLAY_TRANSFORM) {
  const [transform, setTransform] = useState<OverlayTransform>(initialTransform);

  const pan = useCallback((dx: number, dy: number) => {
    setTransform((prev) => applyPan(prev, dx, dy));
  }, []);

  const pinch = useCallback((scaleFactor: number) => {
    setTransform((prev) => applyPinch(prev, scaleFactor));
  }, []);

  const rotate = useCallback((angleDelta: number) => {
    setTransform((prev) => applyRotation(prev, angleDelta));
  }, []);

  const setOpacity = useCallback((opacity: number) => {
    setTransform((prev) => applyOpacity(prev, opacity));
  }, []);

  const setMirrored = useCallback((mirrored: boolean) => {
    setTransform((prev) => applyMirror(prev, mirrored));
  }, []);

  const reset = useCallback(() => {
    setTransform(resetTransform());
  }, []);

  const toggleLocked = useCallback(() => {
    setTransform((prev) => toggleLock(prev));
  }, []);

  return {
    transform,
    setTransform,
    pan,
    pinch,
    rotate,
    setOpacity,
    setMirrored,
    reset,
    toggleLocked,
    isLocked: transform.locked,
    opacity: transform.opacity,
    scale: transform.scale,
    rotation: transform.rotation,
  };
}
