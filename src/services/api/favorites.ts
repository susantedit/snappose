/**
 * Favorites API service module.
 * [Req 37]
 */

import { apiGet, apiPost, apiDelete } from './client';

export interface FavoriteRecord {
  id: string;
  poseId: string;
  createdAt: string;
}

export async function fetchFavorites(): Promise<FavoriteRecord[]> {
  return apiGet<FavoriteRecord[]>('/favorites');
}

export async function addFavoriteRemote(poseId: string): Promise<FavoriteRecord> {
  return apiPost<FavoriteRecord>('/favorites', { poseId });
}

export async function removeFavoriteRemote(poseId: string): Promise<void> {
  return apiDelete<void>(`/favorites/${poseId}`);
}

export async function toggleFavorite(poseId: string, isFavorite: boolean): Promise<FavoriteRecord | void> {
  if (isFavorite) {
    return addFavoriteRemote(poseId);
  } else {
    return removeFavoriteRemote(poseId);
  }
}
