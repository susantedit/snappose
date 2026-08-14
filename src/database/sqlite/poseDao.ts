/**
 * poseDao — SQLite CRUD for poses and pose_landmarks tables.
 * Port of PoseDao.kt to TypeScript.
 * [Req 25.2]
 */

import { getDb } from './db';
import type { Pose } from '@/features/poses/types';
import type { PoseLandmarks } from '@/features/ai/types';

// ---------------------------------------------------------------------------
// Pose DAO
// ---------------------------------------------------------------------------

export async function upsertPose(pose: Pose): Promise<void> {
  const db = getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO poses
     (id, title, category, image, overlay, difficulty, indoor, tags, views, downloads, favorites, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      pose.id,
      pose.title,
      pose.categoryId,
      pose.imageUrl ?? null,
      pose.overlayImage ?? null,
      pose.difficulty,
      pose.indoor ? 1 : 0,
      JSON.stringify(pose.tags ?? []),
      pose.views ?? 0,
      pose.downloads ?? 0,
      pose.favorites ?? 0,
      pose.updatedAt,
    ],
  );
}

export async function getPoseById(id: string): Promise<Pose | null> {
  const db = getDb();
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM poses WHERE id = ?',
    [id],
  );
  return row ? rowToPose(row) : null;
}

export async function getPosesByCategory(
  categoryId: string,
  limit = 50,
  offset = 0,
): Promise<Pose[]> {
  const db = getDb();
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM poses WHERE category = ? ORDER BY updatedAt DESC LIMIT ? OFFSET ?',
    [categoryId, limit, offset],
  );
  return rows.map(rowToPose);
}

export async function searchPoses(keyword: string, limit = 50): Promise<Pose[]> {
  const db = getDb();
  const pattern = `%${keyword}%`;
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM poses WHERE title LIKE ? OR category LIKE ? ORDER BY views DESC LIMIT ?',
    [pattern, pattern, limit],
  );
  return rows.map(rowToPose);
}

export async function deletePose(id: string): Promise<void> {
  const db = getDb();
  await db.runAsync('DELETE FROM poses WHERE id = ?', [id]);
}

// ---------------------------------------------------------------------------
// Landmarks DAO
// ---------------------------------------------------------------------------

export async function upsertLandmarks(poseId: string, landmarks: PoseLandmarks): Promise<void> {
  const db = getDb();
  await db.runAsync(
    'INSERT OR REPLACE INTO pose_landmarks (poseId, landmarks) VALUES (?, ?)',
    [poseId, JSON.stringify(landmarks)],
  );
}

export async function getLandmarks(poseId: string): Promise<PoseLandmarks | null> {
  const db = getDb();
  const row = await db.getFirstAsync<{ landmarks: string }>(
    'SELECT landmarks FROM pose_landmarks WHERE poseId = ?',
    [poseId],
  );
  if (!row) return null;
  try {
    return JSON.parse(row.landmarks) as PoseLandmarks;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Recent searches DAO
// ---------------------------------------------------------------------------

export async function addRecentSearch(keyword: string): Promise<void> {
  const db = getDb();
  const id = `search_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  await db.runAsync(
    'INSERT OR REPLACE INTO recent_searches (id, keyword, createdAt) VALUES (?, ?, ?)',
    [id, keyword.trim(), new Date().toISOString()],
  );
  // Keep only last 20
  await db.runAsync(
    `DELETE FROM recent_searches WHERE id NOT IN (
       SELECT id FROM recent_searches ORDER BY createdAt DESC LIMIT 20
     )`,
  );
}

export async function getRecentSearches(): Promise<string[]> {
  const db = getDb();
  const rows = await db.getAllAsync<{ keyword: string }>(
    'SELECT keyword FROM recent_searches ORDER BY createdAt DESC LIMIT 20',
  );
  return rows.map((r) => r.keyword);
}

// ---------------------------------------------------------------------------
// Recent views DAO
// ---------------------------------------------------------------------------

export async function addRecentView(poseId: string): Promise<void> {
  const db = getDb();
  const id = `view_${poseId}`;
  await db.runAsync(
    'INSERT OR REPLACE INTO recent_views (id, poseId, viewedAt) VALUES (?, ?, ?)',
    [id, poseId, new Date().toISOString()],
  );
  // Keep only last 20
  await db.runAsync(
    `DELETE FROM recent_views WHERE id NOT IN (
       SELECT id FROM recent_views ORDER BY viewedAt DESC LIMIT 20
     )`,
  );
}

export async function getRecentViewedPoseIds(): Promise<string[]> {
  const db = getDb();
  const rows = await db.getAllAsync<{ poseId: string }>(
    'SELECT poseId FROM recent_views ORDER BY viewedAt DESC LIMIT 20',
  );
  return rows.map((r) => r.poseId);
}

// ---------------------------------------------------------------------------
// Row mapper
// ---------------------------------------------------------------------------

function rowToPose(row: Record<string, unknown>): Pose {
  return {
    id: String(row.id ?? ''),
    categoryId: String(row.category ?? ''),
    title: String(row.title ?? ''),
    description: '',
    imageUrl: String(row.image ?? ''),
    overlayImage: String(row.overlay ?? ''),
    thumbnailUrl: String(row.image ?? ''),
    difficulty: (row.difficulty as Pose['difficulty']) ?? 'easy',
    indoor: Number(row.indoor ?? 1) === 1,
    tags: safeParseJSON<string[]>(String(row.tags ?? '[]'), []),
    views: Number(row.views ?? 0),
    downloads: Number(row.downloads ?? 0),
    favorites: Number(row.favorites ?? 0),
    estimatedDistance: 0,
    cameraAngle: '',
    lighting: '',
    orientation: 'portrait',
    createdAt: String(row.updatedAt ?? ''),
    updatedAt: String(row.updatedAt ?? ''),
  };
}

function safeParseJSON<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
