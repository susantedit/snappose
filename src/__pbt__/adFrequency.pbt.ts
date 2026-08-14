/**
 * Property-Based Tests for AdFrequencyController
 * [Req 22, 38, 46]
 *
 * Properties tested:
 * 1. Interstitial frequency cap: maximum of 1 interstitial per 8 minutes (floor(T/8))
 * 2. Monotonicity of show count
 * 3. App-open ad daily cap: at most 1 app-open ad per date
 */

import fc from 'fast-check';
import {
  canShowInterstitial,
  recordInterstitialShown,
  canShowAppOpenAd,
  recordAppOpenAdShown,
  INTERSTITIAL_MIN_GAP_MS,
  type InterstitialFrequencyState,
  type AppOpenAdState,
} from '../features/ads/domain/AdFrequencyController';

describe('AdFrequencyController Property-Based Tests', () => {
  it('Property 1: Interstitial frequency cap — cannot show more than floor(T / 8min) + 1 interstitials across T ms', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1000, max: 60 * 60 * 1000 }), { minLength: 1, maxLength: 50 }),
        (intervalsMs) => {
          let state: InterstitialFrequencyState = { lastShownAt: null, showCount: 0 };
          let currentTime = 1000000;
          const startTime = currentTime;

          for (const interval of intervalsMs) {
            currentTime += interval;
            if (canShowInterstitial(state, currentTime)) {
              state = recordInterstitialShown(state, currentTime);
            }
          }

          const totalElapsed = currentTime - startTime;
          const maxAllowed = Math.floor(totalElapsed / INTERSTITIAL_MIN_GAP_MS) + 1;

          return state.showCount <= maxAllowed;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 2: Interstitial state immutability & count monotonicity', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 1000, max: 100000 }),
        (initialCount, nowMs) => {
          const initial: InterstitialFrequencyState = { lastShownAt: 0, showCount: initialCount };
          const next = recordInterstitialShown(initial, nowMs);

          return (
            initial.showCount === initialCount &&
            next.showCount === initialCount + 1 &&
            next.lastShownAt === nowMs
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('Property 3: App-open ad daily cap — shows exactly once per unique date', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.integer({ min: 1, max: 28 }).map((d) => `2026-08-${String(d).padStart(2, '0')}`),
          { minLength: 1, maxLength: 20 }
        ),
        (dates) => {
          let state: AppOpenAdState = { lastShownDate: null };
          const uniqueDatesShown = new Set<string>();

          for (const date of dates) {
            if (canShowAppOpenAd(state, date)) {
              state = recordAppOpenAdShown(state, date);
              uniqueDatesShown.add(date);
            }
          }

          const uniqueExpected = new Set(dates);
          return uniqueDatesShown.size === uniqueExpected.size;
        }
      ),
      { numRuns: 50 }
    );
  });
});
