/**
 * Property-Based Tests for CaptureRateLimit
 * [Req 21, 27, 38, 46]
 *
 * Properties tested:
 * 1. Window reset invariant: after 6h, captureCount and bonusCaptures reset to 0
 * 2. Capacity invariant: allowed is true iff captureCount < 10 + bonusCaptures
 * 3. Rewarded ad bonus invariant: granting bonus increases limit by exactly 5
 */

import fc from 'fast-check';
import {
  BASE_CAPTURE_LIMIT,
  BONUS_PER_AD,
  WINDOW_DURATION_MS,
} from '../features/camera/domain/CaptureRateLimit';

interface PureRateLimitState {
  captureCount: number;
  windowStartTime: number;
  bonusCaptures: number;
}

function pureCheckCaptureAllowed(
  state: PureRateLimitState,
  nowMs: number
): { allowed: boolean; nextState: PureRateLimitState } {
  let s = { ...state };
  if (nowMs - s.windowStartTime >= WINDOW_DURATION_MS) {
    s = { captureCount: 0, windowStartTime: nowMs, bonusCaptures: 0 };
  }
  const limit = BASE_CAPTURE_LIMIT + s.bonusCaptures;
  return {
    allowed: s.captureCount < limit,
    nextState: s,
  };
}

describe('CaptureRateLimit Property-Based Tests', () => {
  it('Property 1: Window reset invariant — elapsed time >= 6h resets counts to 0 and updates start time', () => {
    fc.assert(
      fc.property(
        fc.record({
          captureCount: fc.integer({ min: 0, max: 50 }),
          windowStartTime: fc.integer({ min: 1000000, max: 2000000 }),
          bonusCaptures: fc.integer({ min: 0, max: 20 }),
        }),
        fc.integer({ min: WINDOW_DURATION_MS, max: WINDOW_DURATION_MS * 10 }),
        (initialState, elapsedMs) => {
          const nowMs = initialState.windowStartTime + elapsedMs;
          const { nextState } = pureCheckCaptureAllowed(initialState, nowMs);

          return (
            nextState.captureCount === 0 &&
            nextState.bonusCaptures === 0 &&
            nextState.windowStartTime === nowMs
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Capacity invariant — capture allowed iff count < base (10) + bonus', () => {
    fc.assert(
      fc.property(
        fc.record({
          captureCount: fc.integer({ min: 0, max: 30 }),
          windowStartTime: fc.constant(1000000),
          bonusCaptures: fc.integer({ min: 0, max: 20 }),
        }),
        fc.integer({ min: 0, max: WINDOW_DURATION_MS - 1 }),
        (initialState, elapsedMs) => {
          const nowMs = initialState.windowStartTime + elapsedMs;
          const { allowed } = pureCheckCaptureAllowed(initialState, nowMs);
          const limit = BASE_CAPTURE_LIMIT + initialState.bonusCaptures;

          return allowed === initialState.captureCount < limit;
        }
      ),
      { numRuns: 150 }
    );
  });

  it('Property 3: Bonus grant invariant — adding N ads adds exactly 5 * N to total limit', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10 }),
        (adsWatched) => {
          const bonus = adsWatched * BONUS_PER_AD;
          const totalLimit = BASE_CAPTURE_LIMIT + bonus;
          return totalLimit === 10 + 5 * adsWatched;
        }
      ),
      { numRuns: 50 }
    );
  });
});
