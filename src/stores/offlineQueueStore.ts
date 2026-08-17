import { mmkvGet, mmkvSet } from '@/database/mmkv/mmkvClient';
import { api } from '@/services/api/client';

export interface QueueItem {
  id: string;
  type: 'TOGGLE_FAVORITE' | 'RECORD_CAPTURE' | 'SUBMIT_FEEDBACK';
  payload: Record<string, unknown>;
  createdAt: number;
  retryCount: number;
}

const QUEUE_KEY = 'offline_mutation_queue';
const MAX_QUEUE_SIZE = 100; // DoS / memory bounds protection

export function getOfflineQueue(): QueueItem[] {
  return mmkvGet<QueueItem[]>(QUEUE_KEY) || [];
}

export function saveOfflineQueue(queue: QueueItem[]): void {
  // Ensure bounds limit
  const boundedQueue = queue.slice(-MAX_QUEUE_SIZE);
  mmkvSet(QUEUE_KEY, boundedQueue);
}

export function enqueueMutation(
  type: QueueItem['type'],
  payload: Record<string, unknown>
): void {
  const queue = getOfflineQueue();

  // Defensive sanitization: reject if payload contains prototype pollution keys
  if (payload && (Object.prototype.hasOwnProperty.call(payload, '__proto__') || Object.prototype.hasOwnProperty.call(payload, 'constructor'))) {
    console.warn('[OfflineQueue] Rejected unsafe mutation payload');
    return;
  }

  const newItem: QueueItem = {
    id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    payload,
    createdAt: Date.now(),
    retryCount: 0,
  };

  queue.push(newItem);
  saveOfflineQueue(queue);
}

export async function processOfflineQueue(): Promise<void> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return;

  const remainingQueue: QueueItem[] = [];

  for (const item of queue) {
    try {
      if (item.type === 'TOGGLE_FAVORITE') {
        const { poseId, isFavorite } = item.payload;
        if (typeof poseId === 'string' && poseId.trim().length > 0) {
          if (isFavorite) {
            await api.post('/favorites', { poseId });
          } else {
            await api.delete(`/favorites/${encodeURIComponent(poseId)}`);
          }
        }
      } else if (item.type === 'RECORD_CAPTURE') {
        await api.post('/captures', item.payload);
      } else if (item.type === 'SUBMIT_FEEDBACK') {
        await api.post('/feedback', item.payload);
      }
      // Success — item dropped from queue
    } catch (err) {
      if (item.retryCount < 3) {
        remainingQueue.push({ ...item, retryCount: item.retryCount + 1 });
      }
      // If retryCount >= 3, drop item to avoid blocking queue infinitely
    }
  }

  saveOfflineQueue(remainingQueue);
}
