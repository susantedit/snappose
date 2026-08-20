/**
 * SQLite database initialisation and migration runner.
 *
 * Tables:
 *   poses, pose_landmarks, favorites, downloads,
 *   recent_searches, recent_views, captured_photos
 *
 * [Req 25.2]
 */

import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { CrashlyticsService } from '@/services/firebase/crashlytics';

// ---------------------------------------------------------------------------
// Database instance
// ---------------------------------------------------------------------------

let _db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!_db) {
    try {
      if (typeof SQLite.openDatabaseSync === 'function') {
        _db = SQLite.openDatabaseSync('snap-pose.db');
        _db.execSync('PRAGMA journal_mode = WAL;');
        _db.execSync('PRAGMA foreign_keys = ON;');
        for (const migration of MIGRATIONS) {
          _db.execSync(migration);
        }
      }
    } catch (err) {
      console.warn('[SQLite] Synchronous init fallback notice:', err);
    }
  }
  if (!_db) {
    if (Platform.OS === 'web') {
      return {
        execAsync: async () => {},
        runAsync: async () => ({ lastInsertRowId: 0, changes: 0 }),
        getFirstAsync: async () => null,
        getAllAsync: async () => [],
        eachAsync: async () => {},
      } as any;
    }
    throw new Error('Database not initialised — call initDatabase() first');
  }
  return _db;
}

// ---------------------------------------------------------------------------
// Schema DDL
// ---------------------------------------------------------------------------

const MIGRATIONS: string[] = [
  // v1 — initial schema
  `CREATE TABLE IF NOT EXISTS poses (
    id         TEXT PRIMARY KEY NOT NULL,
    title      TEXT NOT NULL,
    category   TEXT NOT NULL,
    image      TEXT,
    overlay    TEXT,
    difficulty TEXT NOT NULL DEFAULT 'easy',
    indoor     INTEGER NOT NULL DEFAULT 1,
    tags       TEXT NOT NULL DEFAULT '[]',
    views      INTEGER NOT NULL DEFAULT 0,
    downloads  INTEGER NOT NULL DEFAULT 0,
    favorites  INTEGER NOT NULL DEFAULT 0,
    updatedAt  TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS pose_landmarks (
    poseId     TEXT PRIMARY KEY NOT NULL,
    landmarks  TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS favorites (
    id         TEXT PRIMARY KEY NOT NULL,
    poseId     TEXT NOT NULL,
    createdAt  TEXT NOT NULL,
    UNIQUE(poseId)
  )`,

  `CREATE TABLE IF NOT EXISTS downloads (
    id           TEXT PRIMARY KEY NOT NULL,
    poseId       TEXT NOT NULL UNIQUE,
    version      INTEGER NOT NULL DEFAULT 1,
    downloadedAt TEXT NOT NULL,
    filePath     TEXT NOT NULL,
    sha256       TEXT NOT NULL DEFAULT '',
    sizeBytes    INTEGER NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS recent_searches (
    id        TEXT PRIMARY KEY NOT NULL,
    keyword   TEXT NOT NULL UNIQUE,
    createdAt TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS recent_views (
    id       TEXT PRIMARY KEY NOT NULL,
    poseId   TEXT NOT NULL UNIQUE,
    viewedAt TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS captured_photos (
    id         TEXT PRIMARY KEY NOT NULL,
    poseId     TEXT NOT NULL DEFAULT '',
    localPath  TEXT NOT NULL,
    thumbnail  TEXT NOT NULL DEFAULT '',
    width      INTEGER NOT NULL DEFAULT 0,
    height     INTEGER NOT NULL DEFAULT 0,
    aiScore    INTEGER NOT NULL DEFAULT 0,
    capturedAt TEXT NOT NULL,
    favorite   INTEGER NOT NULL DEFAULT 0
  )`,

  // Indices for common queries
  `CREATE INDEX IF NOT EXISTS idx_favorites_poseId ON favorites(poseId)`,
  `CREATE INDEX IF NOT EXISTS idx_downloads_poseId ON downloads(poseId)`,
  `CREATE INDEX IF NOT EXISTS idx_recent_views_viewedAt ON recent_views(viewedAt)`,
  `CREATE INDEX IF NOT EXISTS idx_captured_photos_capturedAt ON captured_photos(capturedAt)`,
  `CREATE INDEX IF NOT EXISTS idx_poses_category ON poses(category)`,
];

// ---------------------------------------------------------------------------
// initDatabase — call once at app startup in root layout
// ---------------------------------------------------------------------------

/**
 * Open (or create) the SQLite database and run all pending migrations.
 * Safe to call multiple times — migrations are idempotent (CREATE IF NOT EXISTS).
 *
 * [Req 25.2]
 */
export async function initDatabase(): Promise<void> {
  try {
    _db = await SQLite.openDatabaseAsync('snap-pose.db');

    // Enable WAL mode for better concurrent read performance
    await _db.execAsync('PRAGMA journal_mode = WAL;');
    await _db.execAsync('PRAGMA foreign_keys = ON;');

    // Run all migrations
    for (const migration of MIGRATIONS) {
      await _db.execAsync(migration);
    }

    // Seed starter offline curated poses if database is empty
    const countRow = await _db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM poses');
    if (!countRow || countRow.count === 0) {
      const now = new Date().toISOString();
      const initialPoses = [
        {
          id: 'pose_over_shoulder_01',
          title: 'Over the Shoulder Glance',
          category: 'solo-female',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
          overlay: 'https://raw.githubusercontent.com/snap-pose/assets/main/overlays/over_shoulder.png',
          difficulty: 'easy',
          indoor: 0,
          tags: JSON.stringify(['solo', 'portrait', 'glance', 'outdoor']),
          views: 1240,
          downloads: 380,
          favorites: 215,
          updatedAt: now,
        },
        {
          id: 'pose_walking_casual_01',
          title: 'Walking Mid-Stride Casual',
          category: 'urban-street',
          image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
          overlay: 'https://raw.githubusercontent.com/snap-pose/assets/main/overlays/walking_casual.png',
          difficulty: 'easy',
          indoor: 0,
          tags: JSON.stringify(['walking', 'urban', 'candid', 'street']),
          views: 2100,
          downloads: 512,
          favorites: 430,
          updatedAt: now,
        },
        {
          id: 'pose_seated_cafe_01',
          title: 'Seated Cafe Lean & Sip',
          category: 'cafe-coffee-shop',
          image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
          overlay: 'https://raw.githubusercontent.com/snap-pose/assets/main/overlays/seated_cafe.png',
          difficulty: 'medium',
          indoor: 1,
          tags: JSON.stringify(['cafe', 'sitting', 'coffee', 'lifestyle']),
          views: 1870,
          downloads: 440,
          favorites: 310,
          updatedAt: now,
        },
        {
          id: 'pose_mirror_selfie_01',
          title: 'Clean Minimalist Mirror Stance',
          category: 'mirror-selfies',
          image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800',
          overlay: 'https://raw.githubusercontent.com/snap-pose/assets/main/overlays/mirror_selfie.png',
          difficulty: 'easy',
          indoor: 1,
          tags: JSON.stringify(['mirror', 'selfie', 'outfit', 'indoor']),
          views: 3420,
          downloads: 980,
          favorites: 750,
          updatedAt: now,
        },
        {
          id: 'pose_couple_embrace_01',
          title: 'Forehead Touch Embrace',
          category: 'couples-romance',
          image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
          overlay: 'https://raw.githubusercontent.com/snap-pose/assets/main/overlays/couple_embrace.png',
          difficulty: 'medium',
          indoor: 0,
          tags: JSON.stringify(['couple', 'romance', 'sunset', 'wedding']),
          views: 4120,
          downloads: 1200,
          favorites: 920,
          updatedAt: now,
        },
      ];

      for (const p of initialPoses) {
        await _db.runAsync(
          `INSERT OR IGNORE INTO poses (id, title, category, image, overlay, difficulty, indoor, tags, views, downloads, favorites, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.id, p.title, p.category, p.image, p.overlay, p.difficulty, p.indoor, p.tags, p.views, p.downloads, p.favorites, p.updatedAt]
        );
      }
    }
  } catch (err) {
    console.error('[SQLite] initDatabase failed:', err);
    CrashlyticsService.recordError(err, 'SQLiteInitError');
    if (Platform.OS === 'web') {
      console.warn('[SQLite] SQLite unavailable on web; operating in offline fallback mode.');
      return;
    }
    throw err;
  }
}

/**
 * Close the database. Call on app shutdown / in tests.
 */
export async function closeDatabase(): Promise<void> {
  if (_db) {
    await _db.closeAsync();
    _db = null;
  }
}
