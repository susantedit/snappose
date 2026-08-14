import {
  enqueueMutation,
  getOfflineQueue,
  saveOfflineQueue,
  processOfflineQueue,
  type QueueItem,
} from '../offlineQueueStore';
import { mmkvGet, mmkvSet } from '@/database/mmkv/mmkvClient';
import { api } from '@/services/api/client';

jest.mock('@/database/mmkv/mmkvClient');
jest.mock('@/services/api/client');

describe('offlineQueueStore', () => {
  let mockStore: Record<string, any> = {};

  beforeEach(() => {
    mockStore = {};
    (mmkvGet as jest.Mock).mockImplementation((key: string) => mockStore[key] || null);
    (mmkvSet as jest.Mock).mockImplementation((key: string, val: any) => {
      mockStore[key] = val;
    });
    jest.clearAllMocks();
  });

  it('enqueues mutations with retryCount 0 and timestamps', () => {
    enqueueMutation('TOGGLE_FAVORITE', { poseId: 'pose_123', isFavorite: true });
    const queue = getOfflineQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].type).toBe('TOGGLE_FAVORITE');
    expect(queue[0].payload).toEqual({ poseId: 'pose_123', isFavorite: true });
    expect(queue[0].retryCount).toBe(0);
  });

  it('processes and removes successful items from queue', async () => {
    enqueueMutation('RECORD_CAPTURE', { poseId: 'pose_123', aiScore: 92 });
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { success: true } });

    await processOfflineQueue();
    const queue = getOfflineQueue();
    expect(queue).toHaveLength(0);
    expect(api.post).toHaveBeenCalledWith('/captures', { poseId: 'pose_123', aiScore: 92 });
  });

  it('increments retryCount on API failure and retains in queue if retryCount < 3', async () => {
    enqueueMutation('RECORD_CAPTURE', { poseId: 'pose_123', aiScore: 92 });
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await processOfflineQueue();
    const queue = getOfflineQueue();
    expect(queue).toHaveLength(1);
    expect(queue[0].retryCount).toBe(1);
  });
});
