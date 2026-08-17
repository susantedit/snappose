/**
 * LandmarkSerializer — pure domain implementation.
 *
 * Deterministic, idempotent JSON serialization of PoseLandmarks.
 * Two calls with the same input ALWAYS produce identical strings.
 *
 * Correctness properties (PBT):
 *   - Idempotent: serialize(L) === serialize(L) (no random/date in output)
 *   - Round-trip: parse(serialize(L)) deepEquals L within fp tolerance
 *
 * [Req 40]
 */

import type { PoseLandmarks, Landmark } from '../types';

// ---------------------------------------------------------------------------
// serialize
// ---------------------------------------------------------------------------

/**
 * Serialize PoseLandmarks to a deterministic JSON string.
 * Fields are always output in fixed order: x, y, z, visibility.
 * Numbers are rounded to 8 significant decimal places to prevent fp noise.
 */
export function serializeLandmarks(landmarks: PoseLandmarks | { landmarks: PoseLandmarks }): string {
  const lms = Array.isArray(landmarks) ? landmarks : landmarks.landmarks;
  const arr = Array.from(lms || []).map(serializeLandmark);
  return JSON.stringify(arr);
}

function serializeLandmark(lm: Landmark): Record<string, number> {
  return {
    x: roundTo8(lm.x),
    y: roundTo8(lm.y),
    z: roundTo8(lm.z),
    visibility: roundTo8(lm.visibility),
  };
}

/**
 * Round to 8 decimal places to prevent floating-point serialisation variance
 * while preserving all practically relevant precision.
 */
function roundTo8(n: number): number {
  return Math.round(n * 1e8) / 1e8;
}
