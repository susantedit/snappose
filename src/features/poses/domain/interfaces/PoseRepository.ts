import type { Pose, SearchQuery, PagedResult } from '../../types';

/**
 * Abstract data access interface — PoseRepository.
 * [Req 47]
 */
export interface PoseRepository {
  findById(id: string): Promise<Pose | null>;
  findByCategory(slug: string, cursor?: string, limit?: number): Promise<PagedResult<Pose>>;
  search(query: SearchQuery): Promise<PagedResult<Pose>>;
  upsert(pose: Pose): Promise<void>;
}
