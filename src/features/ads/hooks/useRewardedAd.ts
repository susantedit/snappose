/**
 * useRewardedAd — manages the full rewarded-ad lifecycle.
 *
 * Responsibilities:
 *  - Pre-load a rewarded ad using the AdMob SDK via react-native-google-mobile-ads
 *  - Expose isLoaded / isLoading state
 *  - showAd(): show the loaded ad and resolve with { completed: boolean }
 *  - Auto-reload after the ad is shown or dismissed
 *
 * Ad unit ID sourced from EXPO_PUBLIC_ADMOB_REWARDED_ID.
 * [Req 37, Req 22]
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AD_UNIT_ID =
  __DEV__ || !process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID
    ? TestIds.REWARDED
    : process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ShowAdResult {
  completed: boolean;
}

export interface UseRewardedAdReturn {
  /** True when an ad is fully loaded and ready to show. */
  isLoaded: boolean;
  /** True while an ad is being fetched from AdMob servers. */
  isLoading: boolean;
  /** Load (or reload) the rewarded ad. Idempotent when already loaded. */
  loadAd(): void;
  /**
   * Show the loaded rewarded ad.
   * Resolves with `{ completed: true }` if the user watches to completion,
   * or `{ completed: false }` if the user closes early / an error occurs.
   * Rejects only on unexpected SDK errors.
   */
  showAd(): Promise<ShowAdResult>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useRewardedAd(): UseRewardedAdReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Keep a mutable ref to the current RewardedAd instance so callbacks always
  // reference the latest object without causing stale-closure issues.
  const adRef = useRef<RewardedAd | null>(null);

  // Pending show-promise resolver — set when showAd() is awaited.
  const resolveRef = useRef<((result: ShowAdResult) => void) | null>(null);

  // ── createAndLoad ────────────────────────────────────────────────────────

  const createAndLoad = useCallback(() => {
    // Clean up previous instance listeners (best-effort — no public removeAll API)
    adRef.current = null;
    setIsLoaded(false);
    setIsLoading(true);

    const ad = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });

    // ── Loaded ─────────────────────────────────────────────────────────────
    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setIsLoaded(true);
      setIsLoading(false);
    });

    // ── Error ──────────────────────────────────────────────────────────────
    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      setIsLoaded(false);
      setIsLoading(false);
      // Resolve pending show call as incomplete on load error
      resolveRef.current?.({ completed: false });
      resolveRef.current = null;
    });

    // ── Rewarded (full view completed) ─────────────────────────────────────
    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        // Mark the pending show as completed — resolve happens in CLOSED
        // but we capture the earned state here first via a closure flag.
        earnedRef.current = true;
      },
    );

    // ── Closed ────────────────────────────────────────────────────────────
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      const completed = earnedRef.current;
      earnedRef.current = false;

      // Resolve the pending show promise
      resolveRef.current?.({ completed });
      resolveRef.current = null;

      // Clean up listener references
      unsubLoaded();
      unsubError();
      unsubEarned();
      unsubClosed();

      // Auto-reload for next use
      createAndLoad();
    });

    adRef.current = ad;
    ad.load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Mutable flag — tracks whether EARNED_REWARD fired before CLOSED
  const earnedRef = useRef(false);

  // ── Initial load on mount ────────────────────────────────────────────────
  useEffect(() => {
    createAndLoad();
    // No cleanup needed — the CLOSED listener re-creates the instance
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── loadAd (public) ──────────────────────────────────────────────────────
  const loadAd = useCallback(() => {
    if (isLoaded || isLoading) return;
    createAndLoad();
  }, [isLoaded, isLoading, createAndLoad]);

  // ── showAd (public) ──────────────────────────────────────────────────────
  const showAd = useCallback((): Promise<ShowAdResult> => {
    return new Promise((resolve, reject) => {
      const ad = adRef.current;

      if (!ad || !isLoaded) {
        // Ad not ready — treat as incomplete
        resolve({ completed: false });
        return;
      }

      if (resolveRef.current) {
        // Another show is already in progress
        resolve({ completed: false });
        return;
      }

      resolveRef.current = resolve;

      try {
        ad.show();
      } catch (err) {
        resolveRef.current = null;
        reject(err);
      }
    });
  }, [isLoaded]);

  return { isLoaded, isLoading, loadAd, showAd };
}
