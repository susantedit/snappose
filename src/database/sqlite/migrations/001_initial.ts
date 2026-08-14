/**
 * Migration 001 — initial schema.
 * Creates: poses, pose_landmarks, favorites, downloads,
 *          recent_searches, recent_views, captured_photos.
 * Implemented fully in Task 29.
 */

export const migration001 = `
CREATE TABLE IF NOT EXISTS poses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  overlay TEXT,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pose_landmarks (
  poseId TEXT PRIMARY KEY,
  landmarks TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  poseId TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS downloads (
  id TEXT PRIMARY KEY,
  poseId TEXT NOT NULL UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  downloadedAt TEXT NOT NULL,
  filePath TEXT NOT NULL,
  sha256 TEXT
);

CREATE TABLE IF NOT EXISTS recent_searches (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS recent_views (
  id TEXT PRIMARY KEY,
  poseId TEXT NOT NULL,
  viewedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS captured_photos (
  id TEXT PRIMARY KEY,
  poseId TEXT,
  localPath TEXT NOT NULL,
  thumbnail TEXT,
  width INTEGER,
  height INTEGER,
  aiScore INTEGER,
  capturedAt TEXT NOT NULL,
  favorite INTEGER NOT NULL DEFAULT 0
);
`;
