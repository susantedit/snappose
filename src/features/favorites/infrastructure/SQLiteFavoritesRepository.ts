import type { FavoritesRepository } from '../domain/interfaces/FavoritesRepository';
import type { Favorite } from '../types';
import { getDb } from '@/database/sqlite/db';

/**
 * SQLite implementation of FavoritesRepository.
 * Stores user favorites on-device in the `favorites` table.
 * [Req 18, 25.2]
 */
export class SQLiteFavoritesRepository implements FavoritesRepository {
  async findAll(): Promise<Favorite[]> {
    const db = getDb();
    const rows = await db.getAllAsync<{ id: string; poseId: string; createdAt: string }>(
      'SELECT id, poseId, createdAt FROM favorites ORDER BY createdAt DESC'
    );
    return rows;
  }

  async add(poseId: string): Promise<Favorite> {
    const db = getDb();
    const id = `fav_${poseId}`;
    const createdAt = new Date().toISOString();
    await db.runAsync(
      'INSERT OR REPLACE INTO favorites (id, poseId, createdAt) VALUES (?, ?, ?)',
      [id, poseId, createdAt]
    );
    return { id, poseId, createdAt };
  }

  async remove(poseId: string): Promise<void> {
    const db = getDb();
    await db.runAsync('DELETE FROM favorites WHERE poseId = ?', [poseId]);
  }

  async isFavorite(poseId: string): Promise<boolean> {
    const db = getDb();
    const row = await db.getFirstAsync<{ id: string }>(
      'SELECT id FROM favorites WHERE poseId = ?',
      [poseId]
    );
    return Boolean(row);
  }
}
