/**
 * HistoryStore — Local store for "My Poses" and "My Attempts".
 * Tracks capture history, best match scores, attempt timestamps,
 * and user deletion controls.
 */

import { create } from 'zustand';
import { mmkv } from '@/database/mmkv/mmkvClient';

export interface PoseAttempt {
  id: string;
  poseId: string;
  poseTitle: string;
  poseCategory: string;
  score: number;
  photoUri?: string;
  isFavorite?: boolean;
  shared?: boolean;
  timestamp: number;
  mode: 'subject' | 'photographer';
}

interface HistoryState {
  attempts: PoseAttempt[];
  recordAttempt: (attempt: Omit<PoseAttempt, 'id' | 'timestamp'>) => PoseAttempt;
  deleteAttempt: (id: string) => void;
  clearHistory: () => void;
  getBestScoreForPose: (poseId: string) => number;
  getAttemptsForPose: (poseId: string) => PoseAttempt[];
}

const STORAGE_KEY = 'snappose_history_attempts_v1';

function loadPersistedAttempts(): PoseAttempt[] {
  try {
    const raw = mmkv.getString(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[HistoryStore] Failed to load history:', err);
  }
  return [];
}

function persistAttempts(attempts: PoseAttempt[]): void {
  try {
    mmkv.set(STORAGE_KEY, JSON.stringify(attempts));
  } catch (err) {
    console.warn('[HistoryStore] Failed to persist history:', err);
  }
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  attempts: loadPersistedAttempts(),

  recordAttempt: (attemptData) => {
    const newAttempt: PoseAttempt = {
      ...attemptData,
      id: `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
    };
    const next = [newAttempt, ...get().attempts];
    persistAttempts(next);
    set({ attempts: next });
    return newAttempt;
  },

  deleteAttempt: (id) => {
    const next = get().attempts.filter((a) => a.id !== id);
    persistAttempts(next);
    set({ attempts: next });
  },

  clearHistory: () => {
    persistAttempts([]);
    set({ attempts: [] });
  },

  getBestScoreForPose: (poseId) => {
    const matching = get().attempts.filter((a) => a.poseId === poseId);
    if (matching.length === 0) return 0;
    return Math.max(...matching.map((a) => a.score));
  },

  getAttemptsForPose: (poseId) => {
    return get().attempts.filter((a) => a.poseId === poseId);
  },
}));
