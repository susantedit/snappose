import type { PoseRepository } from '../domain/interfaces/PoseRepository';
import type { Pose, SearchQuery, PagedResult } from '../types';
import * as poseDao from '@/database/sqlite/poseDao';

/**
 * SQLite implementation of PoseRepository.
 * Implemented fully for offline-first pose retrieval.
 * [Req 25]
 */
export class SQLitePoseRepository implements PoseRepository {
  async findById(id: string): Promise<Pose | null> {
    return poseDao.getPoseById(id);
  }

  async findByCategory(slug: string, cursor?: string, limit = 20): Promise<PagedResult<Pose>> {
    const offset = cursor ? parseInt(cursor, 10) || 0 : 0;
    const items = await poseDao.getPosesByCategory(slug, limit + 1, offset);
    const hasMore = items.length > limit;
    const pageItems = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore ? String(offset + limit) : undefined;

    return {
      items: pageItems,
      cursor: nextCursor,
      hasMore,
      total: items.length,
    };
  }

  async search(query: SearchQuery): Promise<PagedResult<Pose>> {
    const keyword = query.keyword || '';
    const items = await poseDao.searchPoses(keyword, 50);
    return {
      items,
      hasMore: false,
      total: items.length,
    };
  }

  async upsert(pose: Pose): Promise<void> {
    await poseDao.upsertPose(pose);
  }
}
