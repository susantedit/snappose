/**
 * Property-Based Tests for LandmarkParser and LandmarkSerializer
 * [Req 40, 38, 46]
 *
 * Properties tested:
 * 1. Round-trip: parse(serialize(L)) deepEquals L within floating point precision
 * 2. Idempotent serialisation: serialize(L) === serialize(L) is purely deterministic
 * 3. Error signalling: invalid inputs or malformed JSON always return ParseError, never throw
 */

import fc from 'fast-check';
import { parseLandmarks, isParseError } from '../features/ai/domain/LandmarkParser';
import { serializeLandmarks } from '../features/ai/domain/LandmarkSerializer';
import type { PoseLandmarks, Landmark } from '../features/ai/types';

const arbLandmark = fc.record({
  x: fc.float({ min: -100, max: 100, noNaN: true }),
  y: fc.float({ min: -100, max: 100, noNaN: true }),
  z: fc.float({ min: -100, max: 100, noNaN: true }),
  visibility: fc.float({ min: 0, max: 1, noNaN: true }),
});

const arbPoseLandmarks = fc.array(arbLandmark, { minLength: 33, maxLength: 33 }) as fc.Arbitrary<PoseLandmarks>;

describe('LandmarkParser & Serializer Property-Based Tests', () => {
  it('Property 1: Round-trip property — parse(serialize(L)) recovers all 33 landmarks within 1e-6 precision', () => {
    fc.assert(
      fc.property(arbPoseLandmarks, (landmarks) => {
        const json = serializeLandmarks(landmarks);
        const parseResult = parseLandmarks(json);

        if (isParseError(parseResult)) return false;

        const parsed = parseResult as PoseLandmarks;
        if (parsed.length !== 33) return false;

        return parsed.every((lm, i) => {
          const original = landmarks[i];
          return (
            Math.abs(lm.x - original.x) < 1e-6 &&
            Math.abs(lm.y - original.y) < 1e-6 &&
            Math.abs(lm.z - original.z) < 1e-6 &&
            Math.abs(lm.visibility - original.visibility) < 1e-6
          );
        });
      }),
      { numRuns: 100 }
    );
  });

  it('Property 2: Deterministic serialisation — serialize(L) produces identical string across invocations', () => {
    fc.assert(
      fc.property(arbPoseLandmarks, (landmarks) => {
        const str1 = serializeLandmarks(landmarks);
        const str2 = serializeLandmarks(landmarks);
        return str1 === str2;
      }),
      { numRuns: 100 }
    );
  });

  it('Property 3: Error signalling — invalid or truncated JSON returns ParseError without throwing unhandled exception', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string().filter((s) => {
            try {
              const res = JSON.parse(s);
              return !Array.isArray(res) || res.length < 33;
            } catch {
              return true;
            }
          }),
          fc.constant(''),
          fc.constant('{"not": "an array"}'),
          fc.constant('[{"x": 1}]')
        ),
        (invalidInput) => {
          let threw = false;
          let result;
          try {
            result = parseLandmarks(invalidInput);
          } catch {
            threw = true;
          }

          return !threw && isParseError(result);
        }
      ),
      { numRuns: 100 }
    );
  });
});
