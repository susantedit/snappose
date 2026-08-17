/**
 * AdFrequencyController — pure domain logic for ad frequency caps.
 *
 * All functions are pure (no side effects, no imports).
 * Zero React Native / Expo dependencies — runs in plain Node for testing.
 *
 * [Req 22]
 */

// ---------------------------------------------------------------------------
// Interstitial
// ---------------------------------------------------------------------------

/** Minimum gap between interstitial impressions: 8 minutes in milliseconds. */
export const INTERSTITIAL_MIN_GAP_MS = 8 * 60 * 1000;

export interface InterstitialFrequencyState {
  /** Unix timestamp (ms) when the last interstitial was shown, or null if never. */
  lastShownAt: number | null;
  /** Total number of interstitials shown in the current session. */
  showCount: number;
}

/**
 * Returns true if enough time has elapsed since the last interstitial
 * (or if one has never been shown).
 *
 * @param state  Current interstitial state.
 * @param nowMs  Current time as Unix milliseconds.
 */
export function canShowInterstitial(
  state: InterstitialFrequencyState,
  nowMs: number,
): boolean {
  if (state.lastShownAt === null) {
    return true;
  }
  return nowMs - state.lastShownAt >= INTERSTITIAL_MIN_GAP_MS;
}

/**
 * Returns a new state recording that an interstitial was shown at `nowMs`.
 * The original state is never mutated.
 *
 * @param state  Current interstitial state.
 * @param nowMs  Current time as Unix milliseconds.
 */
export function recordInterstitialShown(
  state: InterstitialFrequencyState,
  nowMs: number,
): InterstitialFrequencyState {
  return {
    lastShownAt: nowMs,
    showCount: state.showCount + 1,
  };
}

// ---------------------------------------------------------------------------
// App-open ad
// ---------------------------------------------------------------------------

export interface AppOpenAdState {
  /**
   * ISO date string 'YYYY-MM-DD' of the last day an app-open ad was shown,
   * or null if it has never been shown.
   */
  lastShownDate: string | null;
}

/**
 * Returns true if the app-open ad has not yet been shown today.
 *
 * @param state      Current app-open state.
 * @param todayDate  Current date as 'YYYY-MM-DD' string.
 */
export function canShowAppOpenAd(
  state: AppOpenAdState,
  todayDate: string,
): boolean {
  return state.lastShownDate !== todayDate;
}

/**
 * Returns a new state recording that the app-open ad was shown on `todayDate`.
 * The original state is never mutated.
 *
 * @param state      Current app-open state.
 * @param todayDate  Current date as 'YYYY-MM-DD' string.
 */
export function recordAppOpenAdShown(
  _state: AppOpenAdState,
  todayDate: string,
): AppOpenAdState {
  return { lastShownDate: todayDate };
}
