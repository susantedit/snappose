/**
 * RewardedAdService — pure domain service for rewarded ad outcomes.
 *
 * Correctness invariants (PBT) [Req 22, Req 37]:
 *   - If completed === true  → bonusGranted === 5 (full view required)
 *   - If completed === false → bonusGranted === 0 (partial / closed)
 *   - bonusGranted is always exactly 0 or 5, never any other value
 *
 * Pure function, zero side effects, zero imports.
 * [Req 37]
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const REWARD_BONUS_CAPTURES = 5;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RewardedAdResult {
  /** Whether the user watched the full ad. */
  completed: boolean;
  /** Number of bonus captures to grant (5 if completed, 0 otherwise). */
  bonusGranted: number;
}

// ---------------------------------------------------------------------------
// processRewardedCompletion
// ---------------------------------------------------------------------------

/**
 * Maps a rewarded ad completion flag to a `RewardedAdResult`.
 *
 * Reward is granted **only** when the full ad has been watched (`completed === true`).
 * Partial view or early close yields zero bonus captures.
 *
 * @param completed - true iff the user watched the ad to completion.
 * @returns RewardedAdResult with bonusGranted === 5 (complete) or 0 (partial/close).
 */
export function processRewardedCompletion(completed: boolean): RewardedAdResult {
  if (completed) {
    return { completed: true, bonusGranted: REWARD_BONUS_CAPTURES };
  }
  return { completed: false, bonusGranted: 0 };
}
