/**
 * Unit tests for CaptureRateLimit domain module.
 *
 * Tests:
 *  - canCapture / checkCaptureAllowed: count boundaries, bonus captures
 *  - recordCapture: increments count
 *  - grantBonusCaptures: adds BONUS_PER_AD
 *  - resetWindowIfExpired: resets count after 6h
 *  - formatTimeUntilReset: human-readable countdown
 *
 * [Req 27, new — ad-supported free tier]
 */

// Isolate MMKV store per test so state doesn't bleed between cases.
// jest.setup.ts already mocks react-native-mmkv with an in-memory store;
// we reset it between tests via clearAll().

import { mmkv } from '@/database/mmkv/mmkvClient';
import {
  checkCaptureAllowed,
  recordCapture,
  grantBonusCaptures,
  formatTimeUntilReset,
  WINDOW_DURATION_MS,
  BASE_CAPTURE_LIMIT,
  BONUS_PER_AD,
  shouldPreloadRewardedAd,
  PRELOAD_AD_THRESHOLD,
} from '../CaptureRateLimit';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Reset all MMKV keys between tests. */
function resetStore(): void {
  mmkv.clearAll();
}

// ---------------------------------------------------------------------------
// checkCaptureAllowed — basic count boundary
// ---------------------------------------------------------------------------

describe('checkCaptureAllowed — count boundary', () => {
  beforeEach(resetStore);

  it('allows capture when count is 0 (well below limit)', () => {
    const result = checkCaptureAllowed();
    expect(result.allowed).toBe(true);
  });

  it('allows capture when count is 9 (one below limit)', () => {
    // Set captureCount to 9
    mmkv.set('captureCount', 9);
    mmkv.set('windowStartTime', Date.now());
    const result = checkCaptureAllowed();
    expect(result.allowed).toBe(true);
    expect(result.captureCount).toBe(9);
  });

  it('blocks capture when count equals BASE_CAPTURE_LIMIT (10) with no bonus', () => {
    mmkv.set('captureCount', BASE_CAPTURE_LIMIT); // 10
    mmkv.set('windowStartTime', Date.now());
    const result = checkCaptureAllowed();
    expect(result.allowed).toBe(false);
    expect(result.captureCount).toBe(BASE_CAPTURE_LIMIT);
  });

  it('blocks capture when count exceeds limit (count=15, bonusCaptures=0)', () => {
    mmkv.set('captureCount', 15);
    mmkv.set('windowStartTime', Date.now());
    const result = checkCaptureAllowed();
    expect(result.allowed).toBe(false);
  });

  it('returns correct limit value (10 when no bonus)', () => {
    const result = checkCaptureAllowed();
    expect(result.limit).toBe(BASE_CAPTURE_LIMIT);
  });
});

// ---------------------------------------------------------------------------
// checkCaptureAllowed — bonus captures
// ---------------------------------------------------------------------------

describe('checkCaptureAllowed — bonus captures', () => {
  beforeEach(resetStore);

  it('allows capture when count=10 and bonusCaptures=5 (count < 10+5)', () => {
    mmkv.set('captureCount', 10);
    mmkv.set('windowStartTime', Date.now());
    mmkv.set('bonusCaptures', 5);
    const result = checkCaptureAllowed();
    expect(result.allowed).toBe(true);
    expect(result.limit).toBe(15);
  });

  it('blocks capture when count=15 and bonusCaptures=5 (count >= 10+5)', () => {
    mmkv.set('captureCount', 15);
    mmkv.set('windowStartTime', Date.now());
    mmkv.set('bonusCaptures', 5);
    const result = checkCaptureAllowed();
    expect(result.allowed).toBe(false);
  });

  it('allows capture when count=14 and bonusCaptures=5 (count < 15)', () => {
    mmkv.set('captureCount', 14);
    mmkv.set('windowStartTime', Date.now());
    mmkv.set('bonusCaptures', 5);
    const result = checkCaptureAllowed();
    expect(result.allowed).toBe(true);
  });

  it('reports bonusCaptures correctly in the check result', () => {
    mmkv.set('captureCount', 3);
    mmkv.set('windowStartTime', Date.now());
    mmkv.set('bonusCaptures', 2);
    const result = checkCaptureAllowed();
    expect(result.bonusCaptures).toBe(2);
    expect(result.limit).toBe(BASE_CAPTURE_LIMIT + 2);
  });
});

// ---------------------------------------------------------------------------
// checkCaptureAllowed — window reset
// ---------------------------------------------------------------------------

describe('checkCaptureAllowed — window reset after 6h', () => {
  beforeEach(resetStore);

  it('resets count to 0 when window has expired (≥6h ago)', () => {
    // Window started more than 6h ago
    const sixHoursAgo = Date.now() - WINDOW_DURATION_MS - 1000;
    mmkv.set('captureCount', 10);
    mmkv.set('windowStartTime', sixHoursAgo);

    // After reset, capture should be allowed with count=0
    const result = checkCaptureAllowed();
    expect(result.allowed).toBe(true);
    expect(result.captureCount).toBe(0);
  });

  it('does NOT reset when window is still active (< 6h ago)', () => {
    const recentTime = Date.now() - 1000; // 1 second ago
    mmkv.set('captureCount', 10);
    mmkv.set('windowStartTime', recentTime);

    const result = checkCaptureAllowed();
    expect(result.allowed).toBe(false);
    expect(result.captureCount).toBe(10);
  });

  it('resets bonusCaptures to 0 on window expiry', () => {
    const sixHoursAgo = Date.now() - WINDOW_DURATION_MS - 1;
    mmkv.set('captureCount', 10);
    mmkv.set('windowStartTime', sixHoursAgo);
    mmkv.set('bonusCaptures', 5);

    const result = checkCaptureAllowed();
    expect(result.bonusCaptures).toBe(0);
    expect(result.allowed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// recordCapture — increments count
// ---------------------------------------------------------------------------

describe('recordCapture', () => {
  beforeEach(resetStore);

  it('increments captureCount by 1', () => {
    mmkv.set('captureCount', 3);
    mmkv.set('windowStartTime', Date.now());
    recordCapture();
    const after = checkCaptureAllowed();
    expect(after.captureCount).toBe(4);
  });

  it('increments from 0 to 1', () => {
    recordCapture();
    const after = checkCaptureAllowed();
    expect(after.captureCount).toBe(1);
  });

  it('resets window and then increments if window expired', () => {
    const sixHoursAgo = Date.now() - WINDOW_DURATION_MS - 1;
    mmkv.set('captureCount', 9);
    mmkv.set('windowStartTime', sixHoursAgo);
    recordCapture();
    // count should be 1 (reset to 0, then +1)
    const after = checkCaptureAllowed();
    expect(after.captureCount).toBe(1);
    expect(after.allowed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// grantBonusCaptures — adds BONUS_PER_AD
// ---------------------------------------------------------------------------

describe('grantBonusCaptures', () => {
  beforeEach(resetStore);

  it(`grants ${BONUS_PER_AD} bonus captures`, () => {
    grantBonusCaptures();
    const state = checkCaptureAllowed();
    expect(state.bonusCaptures).toBe(BONUS_PER_AD);
  });

  it('accumulates bonus on repeated calls', () => {
    grantBonusCaptures();
    grantBonusCaptures();
    const state = checkCaptureAllowed();
    expect(state.bonusCaptures).toBe(BONUS_PER_AD * 2);
  });

  it('allows previously blocked capture after granting bonus', () => {
    mmkv.set('captureCount', BASE_CAPTURE_LIMIT);
    mmkv.set('windowStartTime', Date.now());

    const beforeBonus = checkCaptureAllowed();
    expect(beforeBonus.allowed).toBe(false);

    grantBonusCaptures();

    const afterBonus = checkCaptureAllowed();
    expect(afterBonus.allowed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// shouldPreloadRewardedAd
// ---------------------------------------------------------------------------

describe('shouldPreloadRewardedAd', () => {
  beforeEach(resetStore);

  it(`returns false when captureCount < ${PRELOAD_AD_THRESHOLD}`, () => {
    mmkv.set('captureCount', PRELOAD_AD_THRESHOLD - 1);
    expect(shouldPreloadRewardedAd()).toBe(false);
  });

  it(`returns true when captureCount === ${PRELOAD_AD_THRESHOLD}`, () => {
    mmkv.set('captureCount', PRELOAD_AD_THRESHOLD);
    expect(shouldPreloadRewardedAd()).toBe(true);
  });

  it(`returns true when captureCount > ${PRELOAD_AD_THRESHOLD}`, () => {
    mmkv.set('captureCount', PRELOAD_AD_THRESHOLD + 2);
    expect(shouldPreloadRewardedAd()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// formatTimeUntilReset — human-readable countdown
// ---------------------------------------------------------------------------

describe('formatTimeUntilReset', () => {
  it('returns 00:00:00 for 0ms', () => {
    expect(formatTimeUntilReset(0)).toBe('00:00:00');
  });

  it('returns 00:00:00 for negative ms', () => {
    expect(formatTimeUntilReset(-1000)).toBe('00:00:00');
  });

  it('formats 1 hour correctly', () => {
    expect(formatTimeUntilReset(60 * 60 * 1000)).toBe('01:00:00');
  });

  it('formats 90 minutes correctly', () => {
    expect(formatTimeUntilReset(90 * 60 * 1000)).toBe('01:30:00');
  });

  it('formats 6 hours (full window) correctly', () => {
    expect(formatTimeUntilReset(6 * 60 * 60 * 1000)).toBe('06:00:00');
  });

  it('formats 1 second correctly', () => {
    expect(formatTimeUntilReset(1000)).toBe('00:00:01');
  });

  it('formats 1 minute 30 seconds correctly', () => {
    expect(formatTimeUntilReset(90 * 1000)).toBe('00:01:30');
  });
});

// ---------------------------------------------------------------------------
// msUntilReset — only set when blocked
// ---------------------------------------------------------------------------

describe('checkCaptureAllowed — msUntilReset field', () => {
  beforeEach(resetStore);

  it('returns msUntilReset=0 when capture is allowed', () => {
    const result = checkCaptureAllowed();
    expect(result.msUntilReset).toBe(0);
  });

  it('returns msUntilReset > 0 when capture is blocked', () => {
    mmkv.set('captureCount', BASE_CAPTURE_LIMIT);
    mmkv.set('windowStartTime', Date.now());
    const result = checkCaptureAllowed();
    expect(result.msUntilReset).toBeGreaterThan(0);
    expect(result.msUntilReset).toBeLessThanOrEqual(WINDOW_DURATION_MS);
  });
});

// ---------------------------------------------------------------------------
// usageFraction
// ---------------------------------------------------------------------------

describe('checkCaptureAllowed — usageFraction', () => {
  beforeEach(resetStore);

  it('is 0 when captureCount=0', () => {
    const result = checkCaptureAllowed();
    expect(result.usageFraction).toBe(0);
  });

  it('is 0.5 when captureCount=5 limit=10', () => {
    mmkv.set('captureCount', 5);
    mmkv.set('windowStartTime', Date.now());
    const result = checkCaptureAllowed();
    expect(result.usageFraction).toBeCloseTo(0.5);
  });

  it('is 1 when captureCount equals limit', () => {
    mmkv.set('captureCount', BASE_CAPTURE_LIMIT);
    mmkv.set('windowStartTime', Date.now());
    const result = checkCaptureAllowed();
    expect(result.usageFraction).toBe(1);
  });
});
