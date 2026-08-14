import { parseLandmarks, isParseError } from '../LandmarkParser';
import { serializeLandmarks } from '../LandmarkSerializer';
import { getReferenceSkeletonForKey } from '../PoseScoreCalculator';
import type { PoseLandmarks } from '../../types';

describe('LandmarkParser & LandmarkSerializer', () => {
  const reference = getReferenceSkeletonForKey('WALKING_CASUAL') as PoseLandmarks;

  it('serializes 33 landmarks to valid JSON string', () => {
    const json = serializeLandmarks(reference);
    expect(typeof json).toBe('string');
    const parsed = JSON.parse(json);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(33);
  });

  it('parses valid JSON string back to landmarks', () => {
    const json = serializeLandmarks(reference);
    const result = parseLandmarks(json);

    expect(isParseError(result)).toBe(false);
    if (!isParseError(result)) {
      expect(result).toHaveLength(33);
      expect(result[0].x).toBeCloseTo(reference[0].x, 5);
      expect(result[0].y).toBeCloseTo(reference[0].y, 5);
    }
  });

  it('handles invalid JSON gracefully with ParseError', () => {
    const result = parseLandmarks('{"invalid": true');
    expect(isParseError(result)).toBe(true);
  });

  it('handles incomplete landmark array with ParseError', () => {
    const result = parseLandmarks(JSON.stringify([{ x: 1, y: 2, z: 0, visibility: 1 }]));
    expect(isParseError(result)).toBe(true);
  });
});
