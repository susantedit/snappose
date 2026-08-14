import type { NativeAd, RewardedAd } from '../../types';

/**
 * Abstract AdMob interface.
 * [Req 47]
 */
export interface AdAdapter {
  loadNativeAd(adUnitId: string): Promise<NativeAd>;
  loadRewardedAd(adUnitId: string): Promise<RewardedAd>;
  showInterstitial(adUnitId: string): Promise<void>;
  showAppOpenAd(adUnitId: string): Promise<void>;
  /**
   * Returns true when camera is active or during onboarding — suppresses all ads.
   * [Req 8.10, 22]
   */
  isAdSuppressed(): boolean;
}
