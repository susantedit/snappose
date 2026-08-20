import type { Favorite } from '../../types';

/**
 * Abstract data access interface — FavoritesRepository.
 * [Req 47]
 */
export interface FavoritesRepository {
  findAll(): Promise<Favorite[]>;
  add(poseId: string): Promise<Favorite>;
  addBatch?(poseIds: string[]): Promise<void>;
  remove(poseId: string): Promise<void>;
  removeBatch?(poseIds: string[]): Promise<void>;
  removeAll?(): Promise<void>;
  isFavorite(poseId: string): Promise<boolean>;
}
