/**
 * Poses API service module.
 * [Req 37]
 */

import { apiGet } from './client';
import type { Pose, PagedResult } from '@/features/poses/types';

export interface GetPosesParams {
  categoryId?: string;
  cursor?: string;
  limit?: number;
  search?: string;
}

export async function fetchPoses(params: GetPosesParams = {}): Promise<PagedResult<Pose>> {
  return apiGet<PagedResult<Pose>>('/poses', params as Record<string, unknown>);
}

export async function fetchPoseById(id: string): Promise<Pose> {
  return apiGet<Pose>(`/poses/${id}`);
}
