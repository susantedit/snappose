/**
 * Google AdMob implementation of AdAdapter interface.
 * Uses react-native-google-mobile-ads SDK with full suppression checks.
 *
 * [Req 8.10, 22]
 */

import { MobileAds, InterstitialAd, RewardedAd as MobileRewardedAd, AppOpenAd, TestIds } from 'react-native-google-mobile-ads';
import type { AdAdapter } from '../domain/interfaces/AdAdapter';
import type { NativeAd, RewardedAd } from '../types';
import { useCameraStore } from '@/stores/cameraStore';
import { mmkvGet } from '@/database/mmkv/mmkvClient';
import { MMKV_KEYS } from '@/database/mmkv/keys';

export class AdMobAdapter implements AdAdapter {
  private static instance: AdMobAdapter;

  public static getInstance(): AdMobAdapter {
    if (!AdMobAdapter.instance) {
      AdMobAdapter.instance = new AdMobAdapter();
    }
    return AdMobAdapter.instance;
  }

  public async initialize(): Promise<void> {
    try {
      await MobileAds().initialize();
    } catch (e) {
      console.warn('[AdMobAdapter] Initialize failed:', e);
    }
  }

  public isAdSuppressed(): boolean {
    const isCameraActive = useCameraStore.getState().isActive;
    const onboardingCompleted = mmkvGet<boolean>(MMKV_KEYS.ONBOARDING_COMPLETED) ?? false;
    return isCameraActive || !onboardingCompleted;
  }

  public async loadNativeAd(_adUnitId: string): Promise<NativeAd> {
    if (this.isAdSuppressed()) {
      throw new Error('Ads are suppressed during active camera or onboarding.');
    }
    return {
      headline: 'Discover More Poses',
      body: 'Explore our vast collection of creative pose guides.',
      callToAction: 'View Now',
      advertiser: 'POSEHANUM',
    };
  }

  public async loadRewardedAd(adUnitId: string): Promise<RewardedAd> {
    const unitId = adUnitId || TestIds.REWARDED;
    const rewarded = MobileRewardedAd.createForAdRequest(unitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    return new Promise((resolve, reject) => {
      const unsubscribeLoaded = rewarded.addAdEventListener('loaded' as any, () => {
        resolve({
          show: async (): Promise<boolean> => {
            return new Promise((res) => {
              let rewardEarned = false;
              const unsubscribeReward = rewarded.addAdEventListener('earned_reward' as any, () => {
                rewardEarned = true;
              });
              const unsubscribeClosed = rewarded.addAdEventListener('closed' as any, () => {
                unsubscribeReward();
                unsubscribeClosed();
                res(rewardEarned);
              });
              rewarded.show().catch(() => res(false));
            });
          },
        });
      });

      const unsubscribeError = rewarded.addAdEventListener('error' as any, (err) => {
        unsubscribeLoaded();
        unsubscribeError();
        reject(err);
      });

      rewarded.load();
    });
  }

  public async showInterstitial(adUnitId: string): Promise<void> {
    if (this.isAdSuppressed()) {
      return;
    }
    const unitId = adUnitId || TestIds.INTERSTITIAL;
    const interstitial = InterstitialAd.createForAdRequest(unitId);

    return new Promise((resolve) => {
      const unsubscribeLoaded = interstitial.addAdEventListener('loaded' as any, () => {
        interstitial.show();
      });
      const unsubscribeClosed = interstitial.addAdEventListener('closed' as any, () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        resolve();
      });
      const unsubscribeError = interstitial.addAdEventListener('error' as any, () => {
        unsubscribeLoaded();
        unsubscribeError();
        resolve();
      });

      interstitial.load();
    });
  }

  public async showAppOpenAd(adUnitId: string): Promise<void> {
    if (this.isAdSuppressed()) {
      return;
    }
    const unitId = adUnitId || TestIds.APP_OPEN;
    const appOpenAd = AppOpenAd.createForAdRequest(unitId);

    return new Promise((resolve) => {
      const unsubscribeLoaded = appOpenAd.addAdEventListener('loaded' as any, () => {
        appOpenAd.show();
      });
      const unsubscribeClosed = appOpenAd.addAdEventListener('closed' as any, () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        resolve();
      });
      const unsubscribeError = appOpenAd.addAdEventListener('error' as any, () => {
        unsubscribeLoaded();
        unsubscribeError();
        resolve();
      });

      appOpenAd.load();
    });
  }
}
