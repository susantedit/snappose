import React from 'react';

export const TestIds = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  APP_OPEN: 'ca-app-pub-3940256099942544/3419835294',
  NATIVE: 'ca-app-pub-3940256099942544/2247696110',
};

export const AdEventType = {
  LOADED: 'loaded',
  OPENED: 'opened',
  CLICKED: 'clicked',
  CLOSED: 'closed',
  ERROR: 'error',
} as const;

export const RewardedAdEventType = {
  LOADED: 'loaded',
  EARNED_REWARD: 'earned_reward',
  CLOSED: 'closed',
  ERROR: 'error',
} as const;

class MockAdInstance {
  private listeners: Record<string, Function[]> = {};

  addAdEventListener(event: string, handler: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
    return () => {
      this.listeners[event] = (this.listeners[event] || []).filter((h) => h !== handler);
    };
  }

  load() {
    setTimeout(() => {
      (this.listeners['loaded'] || []).forEach((h) => h());
    }, 50);
  }

  async show() {
    setTimeout(() => {
      (this.listeners['earned_reward'] || []).forEach((h) => h({ type: 'reward', amount: 1 }));
      (this.listeners['closed'] || []).forEach((h) => h());
    }, 100);
    return Promise.resolve();
  }
}

export const MobileAds = () => ({
  initialize: async () => Promise.resolve(),
});

export const InterstitialAd = {
  createForAdRequest: (_unitId?: string, _options?: any) => new MockAdInstance(),
};

export const RewardedAd = {
  createForAdRequest: (_unitId?: string, _options?: any) => new MockAdInstance(),
};

export const AppOpenAd = {
  createForAdRequest: (_unitId?: string, _options?: any) => new MockAdInstance(),
};

export const BannerAd: React.FC<any> = () => null;
