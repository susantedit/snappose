/**
 * Camera domain barrel export.
 *
 * Re-exports all pure domain modules for the camera feature.
 * Zero React Native imports — all modules are testable in Node.
 *
 * Note: CaptureRateLimit is NOT exported here because it has an MMKV
 * dependency and is not a pure domain module.
 *
 * [Req 8, 9, 14, 15, 16]
 */

// Overlay transform engine [Req 9]
export {
  DEFAULT_OVERLAY_TRANSFORM,
  MIN_SCALE,
  MAX_SCALE,
  MIN_ROTATION,
  MAX_ROTATION,
  applyPan,
  applyPinch,
  applyRotation,
  applyOpacity,
  applyMirror,
  resetTransform,
  toggleLock,
} from './OverlayTransformEngine';

// Lighting analysis [Req 15]
export {
  analyseFrame,
  analyseFrameLegacy,
  scoreFromMetrics,
} from './LightingAnalyser';
export type {
  LightingScore,
  LightingCondition,
  LightingSuggestion,
  LightingAnalysisResult,
  LightingResult,
} from './LightingAnalyser';

// Distance estimation [Req 14]
export { estimateDistance } from './DistanceEstimator';
export type {
  DistanceState,
  DistanceInput,
  NormalisedPoint,
} from './DistanceEstimator';

// Face analysis — smile + eye contact [Req 16]
export { analyseFace } from './FaceAnalyser';
export type { FaceAnalysisResult } from './FaceAnalyser';
