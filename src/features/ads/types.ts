/**
 * Ads feature types.
 * [Req 22]
 */

export interface NativeAd {
  headline: string;
  body?: string;
  callToAction?: string;
  advertiser?: string;
  icon?: string;
}

export interface RewardedAd {
  show(): Promise<boolean>;
}
