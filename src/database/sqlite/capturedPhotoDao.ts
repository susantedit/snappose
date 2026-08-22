/**
 * capturedPhotoDao — SQLite CRUD for the captured_photos table.
 *
 * Schema (defined in db.ts):
 *   id         TEXT PRIMARY KEY
 *   poseId     TEXT NOT NULL DEFAULT ''
 *   localPath  TEXT NOT NULL
 *   thumbnail  TEXT NOT NULL DEFAULT ''
 *   width      INTEGER NOT NULL DEFAULT 0
 *   height     INTEGER NOT NULL DEFAULT 0
 *   aiScore    INTEGER NOT NULL DEFAULT 0
 *   capturedAt TEXT NOT NULL
 *   favorite   INTEGER NOT NULL DEFAULT 0  (0=false, 1=true)
 *
 * [Req 8.9, 20]
 */

import type { SQLiteDatabase } from 'expo-sqlite';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CapturedPhoto {
  id: string;
  poseId: string | null;
  localPath: string;
  thumbnail: string;
  width: number;
  height: number;
  aiScore: number;
  capturedAt: string;
  favorite: boolean;
}

export interface InsertCapturedPhotoParams {
  id: string;
  poseId: string | null;
  localPath: string;
  thumbnail: string;
  width: number;
  height: number;
  aiScore: number;
  capturedAt: string;
  favorite: boolean;
}

// ---------------------------------------------------------------------------
// Insert
// ---------------------------------------------------------------------------

/**
 * Insert a new captured photo record.
 * Wraps in try/catch so DB not-yet-initialised errors are handled gracefully.
 */
export async function insertCapturedPhoto(
  db: SQLiteDatabase,
  photo: InsertCapturedPhotoParams,
): Promise<void> {
  try {
    await db.runAsync(
      `INSERT OR REPLACE INTO captured_photos
       (id, poseId, localPath, thumbnail, width, height, aiScore, capturedAt, favorite)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        photo.id,
        photo.poseId ?? '',
        photo.localPath,
        photo.thumbnail,
        photo.width,
        photo.height,
        photo.aiScore,
        photo.capturedAt,
        photo.favorite ? 1 : 0,
      ],
    );
  } catch (err) {
    console.error('[capturedPhotoDao] insertCapturedPhoto failed:', err);
    // Swallow so a DB error never crashes the capture flow
  }
}

/**
 * Bulk batch insert multiple captured photos inside a single transaction.
 * Chunked to avoid oversized statement locks.
 */
export async function batchInsertCapturedPhotos(
  db: SQLiteDatabase,
  photos: InsertCapturedPhotoParams[],
  chunkSize = 50
): Promise<void> {
  if (!photos.length) return;
  try {
    await db.withTransactionAsync(async () => {
      for (let i = 0; i < photos.length; i += chunkSize) {
        const chunk = photos.slice(i, i + chunkSize);
        for (const photo of chunk) {
          await db.runAsync(
            `INSERT OR REPLACE INTO captured_photos
             (id, poseId, localPath, thumbnail, width, height, aiScore, capturedAt, favorite)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              photo.id,
              photo.poseId ?? '',
              photo.localPath,
              photo.thumbnail,
              photo.width,
              photo.height,
              photo.aiScore,
              photo.capturedAt,
              photo.favorite ? 1 : 0,
            ]
          );
        }
      }
    });
  } catch (err) {
    console.error('[capturedPhotoDao] batchInsertCapturedPhotos failed:', err);
  }
}

/**
 * Bulk batch delete multiple captured photos inside a single transaction.
 */
export async function batchDeleteCapturedPhotos(
  db: SQLiteDatabase,
  photoIds: string[]
): Promise<void> {
  if (!photoIds.length) return;
  try {
    const placeholders = photoIds.map(() => '?').join(',');
    await db.runAsync(
      `DELETE FROM captured_photos WHERE id IN (${placeholders})`,
      photoIds
    );
  } catch (err) {
    console.error('[capturedPhotoDao] batchDeleteCapturedPhotos failed:', err);
  }
}

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

/**
 * Get captured photos, newest first.
 * @param limit  Max rows to return (default 100).
 * @param offset Pagination offset (default 0).
 */
export async function getCapturedPhotos(
  db: SQLiteDatabase,
  limit = 100,
  offset = 0,
): Promise<CapturedPhoto[]> {
  try {
    const rows = await db.getAllAsync<Record<string, unknown>>(
      'SELECT * FROM captured_photos ORDER BY capturedAt DESC LIMIT ? OFFSET ?',
      [limit, offset],
    );
    return rows.map(rowToCapturedPhoto);
  } catch (err) {
    console.error('[capturedPhotoDao] getCapturedPhotos failed:', err);
    return [];
  }
}

/**
 * Get a single captured photo by ID.
 */
export async function getCapturedPhotoById(
  db: SQLiteDatabase,
  id: string,
): Promise<CapturedPhoto | null> {
  try {
    const row = await db.getFirstAsync<Record<string, unknown>>(
      'SELECT * FROM captured_photos WHERE id = ?',
      [id],
    );
    return row ? rowToCapturedPhoto(row) : null;
  } catch (err) {
    console.error('[capturedPhotoDao] getCapturedPhotoById failed:', err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

/**
 * Delete a captured photo record by ID.
 */
export async function deleteCapturedPhoto(db: SQLiteDatabase, id: string): Promise<void> {
  try {
    await db.runAsync('DELETE FROM captured_photos WHERE id = ?', [id]);
  } catch (err) {
    console.error('[capturedPhotoDao] deleteCapturedPhoto failed:', err);
  }
}

// ---------------------------------------------------------------------------
// Toggle favorite
// ---------------------------------------------------------------------------

/**
 * Toggle the favorite flag for a captured photo.
 */
export async function setCapturedPhotoFavorite(
  db: SQLiteDatabase,
  id: string,
  favorite: boolean,
): Promise<void> {
  try {
    await db.runAsync(
      'UPDATE captured_photos SET favorite = ? WHERE id = ?',
      [favorite ? 1 : 0, id],
    );
  } catch (err) {
    console.error('[capturedPhotoDao] setCapturedPhotoFavorite failed:', err);
  }
}

// ---------------------------------------------------------------------------
// Row mapper
// ---------------------------------------------------------------------------

function rowToCapturedPhoto(row: Record<string, unknown>): CapturedPhoto {
  return {
    id: String(row.id ?? ''),
    poseId: row.poseId ? String(row.poseId) : null,
    localPath: String(row.localPath ?? ''),
    thumbnail: String(row.thumbnail ?? ''),
    width: Number(row.width ?? 0),
    height: Number(row.height ?? 0),
    aiScore: Number(row.aiScore ?? 0),
    capturedAt: String(row.capturedAt ?? ''),
    favorite: Number(row.favorite ?? 0) === 1,
  };
}
