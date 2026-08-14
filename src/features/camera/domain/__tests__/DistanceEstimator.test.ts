/**
 * Unit tests for DistanceEstimator.
 * [Req 14]
 */

import { estimateDistance } from '../DistanceEstimator';
import type { DistanceInput } from '../DistanceEstimator';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeInput(
  leftX: number,
  rightX: number,
  leftVis = 1,
  rightVis = 1,
  bbox?: number,
): DistanceInput {
  return {
    leftShoulder: { x: leftX, y: 0.5, visibility: leftVis },
    rightShoulder: { x: rightX, y: 0.5, visibility: rightVis },
    bodyBoundingBoxHeight: bbox,
  };
}

// ---------------------------------------------------------------------------
// Shoulder-width based estimation
// ---------------------------------------------------------------------------

describe('estimateDistance — shoulder width', () => {
  it('returns good when shoulder width is within normal range (≈35% of frame)', () => {
    // 0.30 – 0.65 = 0.35 width ratio → within 0.15–0.55 bounds
    expect(estimateDistance(makeInput(0.30, 0.65))).toBe('good');
  });

  it('returns too_close when shoulder width > 55% of frame', () => {
    // 0.10 – 0.72 = 0.62 > 0.55
    expect(estimateDistance(makeInput(0.10, 0.72))).toBe('too_close');
  });

  it('returns too_far when shoulder width < 15% of frame', () => {
    // 0.42 – 0.55 = 0.13 < 0.15
    expect(estimateDistance(makeInput(0.42, 0.55))).toBe('too_far');
  });

  it('handles reversed shoulder order (right < left)', () => {
    // Uses absolute difference so direction doesn't matter
    // 0.65 – 0.30 = 0.35 → good
    expect(estimateDistance(makeInput(0.65, 0.30))).toBe('good');
  });

  it('returns too_close at exactly the TOO_CLOSE_RATIO boundary (>0.55)', () => {
    // 0.0 – 0.56 = 0.56 > 0.55
    expect(estimateDistance(makeInput(0.0, 0.56))).toBe('too_close');
  });

  it('returns good at exactly TOO_CLOSE_RATIO (=0.55)', () => {
    // 0.0 – 0.55 = 0.55 is NOT > 0.55 → good
    expect(estimateDistance(makeInput(0.0, 0.55))).toBe('good');
  });

  it('returns too_far at exactly TOO_FAR_RATIO (=0.15)', () => {
    // 0.40 – 0.55 = 0.15 is NOT < 0.15 → good
    expect(estimateDistance(makeInput(0.40, 0.55))).toBe('good');
  });

  it('returns too_far when width is 0.14', () => {
    // 0.40 – 0.54 = 0.14 < 0.15
    expect(estimateDistance(makeInput(0.40, 0.54))).toBe('too_far');
  });
});

// ---------------------------------------------------------------------------
// Low-confidence fallback to bounding box
// ---------------------------------------------------------------------------

describe('estimateDistance — bounding box fallback', () => {
  it('falls back to bounding box when shoulder visibility is low', () => {
    const input = makeInput(0.40, 0.55, 0.3, 0.3, 0.5);
    // shoulder conf < 0.60 → uses bbox: 0.5 is within [0.25, 0.80] → good
    expect(input).toBeDefined();
    expect(estimateDistance(input)).toBe('good');
  });

  it('returns too_close via bbox when bboxHeight > 0.80', () => {
    const input = makeInput(0.40, 0.55, 0.3, 0.3, 0.85);
    expect(estimateDistance(input)).toBe('too_close');
  });

  it('returns too_far via bbox when bboxHeight < 0.25', () => {
    const input = makeInput(0.40, 0.55, 0.3, 0.3, 0.20);
    expect(estimateDistance(input)).toBe('too_far');
  });

  it('defaults to good when both shoulders and bbox are unavailable', () => {
    const input: DistanceInput = {
      leftShoulder: { x: 0.3, y: 0.5, visibility: 0.1 },
      rightShoulder: { x: 0.6, y: 0.5, visibility: 0.1 },
    };
    expect(estimateDistance(input)).toBe('good');
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe('estimateDistance — edge cases', () => {
  it('treats missing visibility as fully confident (defaults to 1)', () => {
    // No visibility field → treated as 1.0 → uses shoulder path
    const input: DistanceInput = {
      leftShoulder: { x: 0.30, y: 0.5 },
      rightShoulder: { x: 0.65, y: 0.5 },
    };
    expect(estimateDistance(input)).toBe('good');
  });

  it('handles identical shoulder x positions (zero width) → too_far', () => {
    expect(estimateDistance(makeInput(0.5, 0.5))).toBe('too_far');
  });
});
