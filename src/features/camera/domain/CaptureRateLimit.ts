/**
 * CaptureRateLimit — client-side photo capture rate limiting.
 *
 * Enforces: 10 captures per 6-hour rolling window (+ bonus captures from ads).
 *
 * MMKV keys:
 *   captureCount      — int, captures in current window
 *   windowStartTime   — ms timestamp, start of current window
 *   bonusCaptures     — int, extra captures granted by rewarded ads
 *
 * Correctness properties (PBT) [Req 27]:
 *   - Window reset: after 6h, captureCount resets to 0
 *   - Count boundary: blocked when captureCount ≥ 10 + bonusCaptures
 *   - Bonus grant: bonusCaptures += 5 after rewarded ad
 *
 * [Req new — ad-supported free tier]
 */

import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const WINDOW_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours
export const BASE_CAPTURE_LIMIT = 10;
export const BONUS_PER_AD = 5;
export const PRELOAD_AD_THRESHOLD = 8; // pre-load rewarded ad when this many used

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RateLimitState {
  captureCount: number;
  windowStartTime: number;
  bonusCaptures: number;
}

export interface RateLimitCheck {
  allowed: boolean;
  captureCount: number;
  limit: number;
  bonusCaptures: number;
  /** ms until window resets (0 if not limited). */
  msUntilReset: number;
  /** Fraction used: captureCount / limit (0–1+). */
  usageFraction: number;
}

// ---------------------------------------------------------------------------
// State readers/writers
// ---------------------------------------------------------------------------

export function readRateLimitState(): RateLimitState {
  return {
    captureCount: mmkv.getNumber(MMKV_KEYS.CAPTURE_COUNT) ?? 0,
    windowStartTime: mmkv.getNumber(MMKV_KEYS.WINDOW_START_TIME) ?? Date.now(),
    bonusCaptures: mmkv.getNumber(MMKV_KEYS.BONUS_CAPTURES) ?? 0,
  };
}

function writeRateLimitState(state: RateLimitState): void {
  mmkv.set(MMKV_KEYS.CAPTURE_COUNT, state.captureCount);
  mmkv.set(MMKV_KEYS.WINDOW_START_TIME, state.windowStartTime);
  mmkv.set(MMKV_KEYS.BONUS_CAPTURES, state.bonusCaptures);
}

// ---------------------------------------------------------------------------
// checkCaptureAllowed — call before every capture
// ---------------------------------------------------------------------------

/**
 * Check whether capture is allowed right now.
 * Also resets the window if 6h have elapsed.
 *
 * Does NOT increment the counter — call `recordCapture()` after a successful capture.
 */
export function checkCaptureAllowed(nowMs = Date.now()): RateLimitCheck {
  let state = readRateLimitState();

  // ── Window reset check ───────────────────────────────────────────────────
  if (nowMs - state.windowStartTime >= WINDOW_DURATION_MS) {
    state = { captureCount: 0, windowStartTime: nowMs, bonusCaptures: 0 };
    writeRateLimitState(state);
  }

  const limit = BASE_CAPTURE_LIMIT + state.bonusCaptures;
  const allowed = state.captureCount < limit;
  const msUntilReset = allowed
    ? 0
    : Math.max(0, WINDOW_DURATION_MS - (nowMs - state.windowStartTime));

  return {
    allowed,
    captureCount: state.captureCount,
    limit,
    bonusCaptures: state.bonusCaptures,
    msUntilReset,
    usageFraction: limit > 0 ? state.captureCount / limit : 1,
  };
}

// ---------------------------------------------------------------------------
// recordCapture — call after a successful capture
// ---------------------------------------------------------------------------

/**
 * Increment capture counter after a successful photo capture.
 * Should only be called when `checkCaptureAllowed()` returned allowed = true.
 */
export function recordCapture(nowMs = Date.now()): void {
  let state = readRateLimitState();

  // Reset window if expired
  if (nowMs - state.windowStartTime >= WINDOW_DURATION_MS) {
    state = { captureCount: 0, windowStartTime: nowMs, bonusCaptures: 0 };
  }

  state.captureCount = state.captureCount + 1;
  writeRateLimitState(state);
}

// ---------------------------------------------------------------------------
// grantBonusCaptures — call after rewarded ad completion
// ---------------------------------------------------------------------------

/**
 * Grant `BONUS_PER_AD` (5) additional captures after a rewarded ad.
 * [Req 37 — rewarded ad unlock]
 */
export function grantBonusCaptures(): void {
  const state = readRateLimitState();
  state.bonusCaptures = state.bonusCaptures + BONUS_PER_AD;
  writeRateLimitState(state);
}

// ---------------------------------------------------------------------------
// shouldPreloadRewardedAd
// ---------------------------------------------------------------------------

/**
 * Returns true when captureCount ≥ PRELOAD_AD_THRESHOLD so the rewarded ad
 * can be pre-loaded before the limit is actually hit. [Req 37]
 */
export function shouldPreloadRewardedAd(): boolean {
  const { captureCount } = readRateLimitState();
  return captureCount >= PRELOAD_AD_THRESHOLD;
}

// ---------------------------------------------------------------------------
// formatTimeUntilReset — UI helper
// ---------------------------------------------------------------------------

export function formatTimeUntilReset(msUntilReset: number): string {
  if (msUntilReset <= 0) return '00:00:00';
  const totalSeconds = Math.ceil(msUntilReset / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}
