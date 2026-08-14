import type { Favorite } from '../../types';

/**
 * Abstract data access interface — FavoritesRepository.
 * [Req 47]
 */
export interface FavoritesRepository {
  findAll(): Promise<Favorite[]>;
  add(poseId: string): Promise<Favorite>;
  remove(poseId: string): Promise<void>;
  isFavorite(poseId: string): Promise<boolean>;
}
