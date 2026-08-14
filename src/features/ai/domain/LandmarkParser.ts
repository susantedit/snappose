/**
 * LandmarkParser — pure domain implementation.
 *
 * Parses JSON strings to PoseLandmarks (33 entries, each with x/y/z/visibility).
 * On malformed/missing fields: returns ParseError, never throws. [Req 40]
 *
 * Correctness properties (PBT):
 *   - Round-trip: parse(serialize(L)) deepEquals L within fp tolerance
 *   - Error on invalid input: parse(s) returns ParseError for all invalid JSON
 *   - Idempotent serialisation: serialize(L) is deterministic
 *
 * [Req 40]
 */

import type { ParseError, ParseResult, PoseLandmarks, Landmark } from '../types';

const LANDMARK_COUNT = 33;

// ---------------------------------------------------------------------------
// parse
// ---------------------------------------------------------------------------

/**
 * Parse a JSON string to PoseLandmarks.
 * Returns ParseError for any invalid or malformed input.
 */
export function parseLandmarks(raw: string): ParseResult<PoseLandmarks> {
  if (!raw || typeof raw !== 'string') {
    return parseError('Input is not a string');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return parseError(`Invalid JSON: ${(e as Error).message}`);
  }

  if (!Array.isArray(parsed)) {
    return parseError('Expected an array of landmarks');
  }

  if (parsed.length < LANDMARK_COUNT) {
    return parseError(`Expected ${LANDMARK_COUNT} landmarks, got ${parsed.length}`);
  }

  const landmarks: Landmark[] = [];
  for (let i = 0; i < LANDMARK_COUNT; i++) {
    const item = parsed[i];
    const result = parseLandmark(item, i);
    if (result.kind === 'ParseError') return result;
    landmarks.push(result.value);
  }

  return landmarks as PoseLandmarks;
}

function parseLandmark(
  item: unknown,
  index: number,
): { kind: 'ok'; value: Landmark } | ParseError {
  if (!item || typeof item !== 'object') {
    return parseError(`Landmark[${index}] is not an object`);
  }
  const obj = item as Record<string, unknown>;

  const x = toFiniteNumber(obj.x);
  const y = toFiniteNumber(obj.y);
  const z = toFiniteNumber(obj.z);
  const visibility = toFiniteNumber(obj.visibility);

  if (x === null) return parseError(`Landmark[${index}].x is not a finite number`);
  if (y === null) return parseError(`Landmark[${index}].y is not a finite number`);
  if (z === null) return parseError(`Landmark[${index}].z is not a finite number`);
  if (visibility === null) return parseError(`Landmark[${index}].visibility is not a finite number`);

  return { kind: 'ok', value: { x, y, z, visibility } };
}

function toFiniteNumber(v: unknown): number | null {
  if (typeof v !== 'number' || !isFinite(v)) return null;
  return v;
}

function parseError(message: string): ParseError {
  return { kind: 'ParseError', message };
}

// ---------------------------------------------------------------------------
// isParseError type guard (re-exported from types for convenience)
// ---------------------------------------------------------------------------

export function isParseError<T>(result: ParseResult<T>): result is ParseError {
  return (result as ParseError).kind === 'ParseError';
}
