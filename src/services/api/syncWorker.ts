/**
 * SyncWorker — POSEHANUM
 *
 * Background worker for synchronizing offline mutation queues, favorites,
 * and user-created templates when network connectivity is available.
 */

import { processOfflineQueue, getOfflineQueue } from '@/stores/offlineQueueStore';

export class SyncWorker {
  private isSyncing = false;
  private intervalId: any = null;

  /**
   * Starts background synchronization polling at the specified interval.
   */
  public start(intervalMs = 30000): void {
    if (this.intervalId) return;

    // Trigger initial sync attempt
    this.syncNow();

    this.intervalId = setInterval(() => {
      this.syncNow();
    }, intervalMs);
  }

  /**
   * Stops background synchronization polling.
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Executes an immediate synchronization cycle.
   */
  public async syncNow(): Promise<{ pendingItems: number; synced: boolean }> {
    if (this.isSyncing) {
      return { pendingItems: getOfflineQueue().length, synced: false };
    }

    this.isSyncing = true;
    try {
      await processOfflineQueue();
      const remaining = getOfflineQueue().length;
      return { pendingItems: remaining, synced: true };
    } catch {
      return { pendingItems: getOfflineQueue().length, synced: false };
    } finally {
      this.isSyncing = false;
    }
  }
}

export const syncWorker = new SyncWorker();
