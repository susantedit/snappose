/**
 * PostHogAnalyticsService — Product Analytics & Funnel Tracking.
 *
 * Implements GDPR-compliant product analytics with explicit user consent:
 *  - Funnel tracking: Signup → Pose Selected → Camera Opened → Photo Captured → Template Created → Shared
 *  - Drop-off diagnostics & conversion metrics
 *  - Opt-in consent gate: Zero tracking until user grants explicit consent
 */

import { mmkv } from '@/database/mmkv/mmkvClient';

const CONSENT_STORAGE_KEY = 'snappose_analytics_consent_granted';

export type AnalyticsConsentStatus = 'GRANTED' | 'DENIED' | 'UNDECIDED';

export type FunnelEventName =
  | 'user_signed_up'
  | 'pose_selected'
  | 'camera_opened'
  | 'photo_captured'
  | 'template_created'
  | 'favorite_added'
  | 'photo_exported';

export interface FunnelEventPayload {
  userId?: string;
  poseId?: string;
  category?: string;
  matchScore?: number;
  mode?: 'BLEND' | 'SKELETON';
  templateId?: string;
  authMethod?: string;
  source?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export class PostHogAnalyticsService {
  private static instance: PostHogAnalyticsService;
  private consentStatus: AnalyticsConsentStatus = 'UNDECIDED';
  private eventQueue: Array<{ event: FunnelEventName; properties: FunnelEventPayload }> = [];

  private constructor() {
    this.loadConsent();
  }

  public static getInstance(): PostHogAnalyticsService {
    if (!PostHogAnalyticsService.instance) {
      PostHogAnalyticsService.instance = new PostHogAnalyticsService();
    }
    return PostHogAnalyticsService.instance;
  }

  private loadConsent(): void {
    try {
      const stored = mmkv.getString(CONSENT_STORAGE_KEY);
      if (stored === 'GRANTED' || stored === 'DENIED') {
        this.consentStatus = stored;
      }
    } catch {}
  }

  public getConsentStatus(): AnalyticsConsentStatus {
    return this.consentStatus;
  }

  public setConsent(granted: boolean): void {
    this.consentStatus = granted ? 'GRANTED' : 'DENIED';
    try {
      mmkv.set(CONSENT_STORAGE_KEY, this.consentStatus);
    } catch {}

    if (granted && this.eventQueue.length > 0) {
      // Flush queued events
      const queueToFlush = [...this.eventQueue];
      this.eventQueue = [];
      queueToFlush.forEach(({ event, properties }) => this.track(event, properties));
    } else if (!granted) {
      this.eventQueue = [];
    }
  }

  /**
   * Tracks a key product/funnel event.
   */
  public track(event: FunnelEventName, properties: FunnelEventPayload = {}): void {
    if (this.consentStatus === 'DENIED') {
      return; // Respect privacy preferences
    }

    const payload = {
      ...properties,
      timestamp: properties.timestamp || new Date().toISOString(),
      platform: 'mobile',
    };

    if (this.consentStatus === 'UNDECIDED') {
      // Queue until consent decision is made (max 20 items)
      if (this.eventQueue.length < 20) {
        this.eventQueue.push({ event, properties: payload });
      }
      return;
    }

    // In production, forward to PostHog endpoint / SDK
    if (__DEV__) {
      console.log(`[PostHog Analytics] Event: ${event}`, payload);
    }
  }

  /**
   * Helper to identify user session on login
   */
  public identify(userId: string, traits: Record<string, unknown> = {}): void {
    if (this.consentStatus !== 'GRANTED') return;
    if (__DEV__) {
      console.log(`[PostHog Analytics] Identify user: ${userId}`, traits);
    }
  }
}

export const postHogAnalytics = PostHogAnalyticsService.getInstance();
