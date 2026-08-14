/**
 * Captures API service module.
 * Records photo captures and bonus grants to MongoDB.
 * [Req 37]
 */

import { apiPost } from './client';

export interface CaptureRecord {
  poseId: string;
  aiScore: number;
  capturedAt: string;
}

export async function recordCapture(record: CaptureRecord): Promise<void> {
  return apiPost<void>('/captures', record);
}

export async function recordBonusGrant(bonusCount: number): Promise<void> {
  return apiPost<void>('/captures/bonus', { bonusCount });
}

export async function fetchCaptureStats(): Promise<{
  captureCount: number;
  windowStartTime: number;
  bonusCaptures: number;
}> {
  const { apiGet } = await import('./client');
  return apiGet('/user/capture-stats');
}
