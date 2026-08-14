import { useQuery } from '@tanstack/react-query';
import { fetchPoses, fetchPoseById, GetPosesParams } from '@/services/api/poses';
import { SQLitePoseRepository } from '@/features/poses/infrastructure/SQLitePoseRepository';
import type { Pose, PagedResult } from '@/features/poses/types';

const sqliteRepo = new SQLitePoseRepository();

export function usePoses(params: GetPosesParams = {}) {
  return useQuery<PagedResult<Pose>>({
    queryKey: ['poses', params],
    queryFn: async () => {
      try {
        const remoteData = await fetchPoses(params);
        // Cache to local SQLite asynchronously
        remoteData.items.forEach((p) => sqliteRepo.upsert(p));
        return remoteData;
      } catch (err) {
        // Offline fallback to SQLite
        if (params.categoryId) {
          return sqliteRepo.findByCategory(params.categoryId, params.cursor, params.limit);
        }
        return sqliteRepo.search({ keyword: params.search });
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function usePoseDetail(id: string) {
  return useQuery<Pose | null>({
    queryKey: ['pose', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const remotePose = await fetchPoseById(id);
        if (remotePose) {
          sqliteRepo.upsert(remotePose);
        }
        return remotePose;
      } catch (err) {
        return sqliteRepo.findById(id);
      }
    },
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 60 * 24,
  });
}
