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

  async addBatch(poseIds: string[]): Promise<void> {
    if (!poseIds.length) return;
    const db = getDb();
    const now = new Date().toISOString();
    // Chunk in batches of 50 to avoid oversized SQL statements
    const chunkSize = 50;
    for (let i = 0; i < poseIds.length; i += chunkSize) {
      const chunk = poseIds.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => '(?, ?, ?)').join(', ');
      const params: string[] = [];
      chunk.forEach((pId) => {
        params.push(`fav_${pId}`, pId, now);
      });
      await db.runAsync(
        `INSERT OR REPLACE INTO favorites (id, poseId, createdAt) VALUES ${placeholders}`,
        params
      );
    }
  }

  async remove(poseId: string): Promise<void> {
    const db = getDb();
    await db.runAsync('DELETE FROM favorites WHERE poseId = ?', [poseId]);
  }

  async removeBatch(poseIds: string[]): Promise<void> {
    if (!poseIds.length) return;
    const db = getDb();
    const chunkSize = 100;
    for (let i = 0; i < poseIds.length; i += chunkSize) {
      const chunk = poseIds.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => '?').join(', ');
      await db.runAsync(`DELETE FROM favorites WHERE poseId IN (${placeholders})`, chunk);
    }
  }

  async removeAll(): Promise<void> {
    const db = getDb();
    await db.runAsync('DELETE FROM favorites');
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
