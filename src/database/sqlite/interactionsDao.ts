/**
 * interactionsDao — SQLite CRUD for offline logging of user interaction signals.
 *
 * Schema:
 *   id          TEXT PRIMARY KEY
 *   type        TEXT NOT NULL
 *   poseId      TEXT
 *   categoryId  TEXT
 *   score       REAL
 *   timestamp   TEXT NOT NULL
 */

import type { SQLiteDatabase } from 'expo-sqlite';
import type { InteractionSignal } from '@/features/personalization/types';

export async function insertInteractionSignal(
  db: SQLiteDatabase,
  signal: InteractionSignal,
): Promise<void> {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO user_pose_interactions (id, type, poseId, categoryId, score, timestamp)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [
        signal.id,
        signal.type,
        signal.poseId ?? null,
        signal.categoryId ?? null,
        signal.score ?? null,
        signal.timestamp,
      ],
    );
  } catch {
    // Graceful fallback for web/uninitialized db
  }
}

export async function getRecentInteractions(
  db: SQLiteDatabase,
  limit: number = 50,
): Promise<InteractionSignal[]> {
  try {
    const rows = await db.getAllAsync<{
      id: string;
      type: string;
      poseId: string | null;
      categoryId: string | null;
      score: number | null;
      timestamp: string;
    }>(
      `SELECT id, type, poseId, categoryId, score, timestamp
       FROM user_pose_interactions
       ORDER BY timestamp DESC
       LIMIT ?;`,
      [limit],
    );

    return rows.map((r) => ({
      id: r.id,
      type: r.type as any,
      poseId: r.poseId ?? undefined,
      categoryId: r.categoryId ?? undefined,
      score: r.score ?? undefined,
      timestamp: r.timestamp,
    }));
  } catch {
    return [];
  }
}

export async function clearAllInteractions(db: SQLiteDatabase): Promise<void> {
  try {
    await db.runAsync(`DELETE FROM user_pose_interactions;`);
  } catch {
    // Graceful fallback
  }
}
