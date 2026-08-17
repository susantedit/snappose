import { useCallback, useRef } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { mmkv } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';
import {
  canShowInterstitial,
  recordInterstitialShown,
  type InterstitialFrequencyState,
} from '../domain/AdFrequencyController';

/**
 * Resolve the interstitial ad unit ID.
 * Falls back to the AdMob test ID in non-production environments.
 */
const AD_UNIT_ID: string =
  process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID ?? TestIds.INTERSTITIAL;

/**
 * useInterstitialAd — manages pre-loading and frequency-capped showing
 * of AdMob interstitial ads.
 *
 * Frequency cap: maximum once every 8 minutes of active use.
 * Last shown timestamp is persisted in MMKV so the cap survives app restarts.
 *
 * [Req 22]
 */
export function useInterstitialAd() {
  // Keep a stable reference to the current ad instance between renders.
  const adRef = useRef<ReturnType<typeof InterstitialAd.createForAdRequest> | null>(null);

  /**
   * Pre-loads an interstitial so it is ready to display without latency.
   * Safe to call multiple times — the existing loaded ad is replaced.
   */
  const loadInterstitial = useCallback(() => {
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });
    ad.load();
    adRef.current = ad;
  }, []);

  /**
   * Reads the current frequency state from MMKV.
   */
  const readState = useCallback((): InterstitialFrequencyState => {
    const raw = mmkv.getString(MMKV_KEYS.LAST_INTERSTITIAL_TIMESTAMP);
    const lastShownAt = raw !== undefined ? Number(raw) : null;
    const showCount = mmkv.getNumber(MMKV_KEYS.LAST_INTERSTITIAL_TIMESTAMP + '_count') ?? 0;
    return { lastShownAt: lastShownAt !== null && !isNaN(lastShownAt) ? lastShownAt : null, showCount };
  }, []);

  /**
   * Persists frequency state to MMKV.
   */
  const writeState = useCallback((state: InterstitialFrequencyState) => {
    if (state.lastShownAt !== null) {
      mmkv.set(MMKV_KEYS.LAST_INTERSTITIAL_TIMESTAMP, String(state.lastShownAt));
    }
    mmkv.set(MMKV_KEYS.LAST_INTERSTITIAL_TIMESTAMP + '_count', state.showCount);
  }, []);

  /**
   * Shows the interstitial only if the 8-minute frequency cap allows it.
   * If the cap prevents showing, or no ad is loaded, this is a no-op.
   *
   * @param nowMs  Current time in ms — defaults to Date.now(). Injected for testability.
   */
  const showInterstitialIfAllowed = useCallback(
    async (nowMs: number = Date.now()): Promise<void> => {
      const state = readState();

      if (!canShowInterstitial(state, nowMs)) {
        return;
      }

      const ad = adRef.current;
      if (ad === null) {
        return;
      }

      return new Promise<void>((resolve) => {
        const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
          unsubscribeClosed();
          const newState = recordInterstitialShown(state, nowMs);
          writeState(newState);
          // Pre-load the next ad so it is ready for the following session.
          loadInterstitial();
          resolve();
        });

        const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, () => {
          unsubscribeError();
          resolve();
        });

        try {
          ad.show();
        } catch {
          unsubscribeClosed();
          unsubscribeError();
          resolve();
        }
      });
    },
    [readState, writeState, loadInterstitial],
  );

  return { loadInterstitial, showInterstitialIfAllowed };
}
