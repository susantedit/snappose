#!/usr/bin/env node
/**
 * download-mediapipe-model.js
 *
 * Downloads the MediaPipe PoseLandmarker model asset required for on-device
 * pose detection in POSEHANUM.
 *
 * Run BEFORE `npx expo run:android`:
 *   node scripts/download-mediapipe-model.js
 *
 * The model is placed in:
 *   android/app/src/main/assets/pose_landmarker_full.task
 *
 * Model source (Apache 2.0 License):
 *   https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task
 *
 * Size: approximately 9 MB
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task';

const DEST_DIR = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets');
const DEST_FILE = path.join(DEST_DIR, 'pose_landmarker_full.task');

if (fs.existsSync(DEST_FILE)) {
  const stat = fs.statSync(DEST_FILE);
  if (stat.size > 1_000_000) {
    console.log(`[MediaPipe] Model already present at ${DEST_FILE} (${(stat.size / 1024 / 1024).toFixed(1)} MB). Skipping download.`);
    process.exit(0);
  }
}

console.log('[MediaPipe] Creating assets directory...');
fs.mkdirSync(DEST_DIR, { recursive: true });

console.log('[MediaPipe] Downloading pose_landmarker_full.task (~9 MB)...');
console.log(`[MediaPipe] Source: ${MODEL_URL}`);

const file = fs.createWriteStream(DEST_FILE);

function download(url, redirectCount = 0) {
  if (redirectCount > 5) {
    console.error('[MediaPipe] Too many redirects.');
    process.exit(1);
  }

  https.get(url, (response) => {
    if (response.statusCode === 301 || response.statusCode === 302) {
      download(response.headers.location, redirectCount + 1);
      return;
    }

    if (response.statusCode !== 200) {
      console.error(`[MediaPipe] HTTP ${response.statusCode} — download failed.`);
      fs.unlinkSync(DEST_FILE);
      process.exit(1);
    }

    const totalBytes = parseInt(response.headers['content-length'] || '0', 10);
    let downloadedBytes = 0;
    let lastLogPercent = -1;

    response.on('data', (chunk) => {
      downloadedBytes += chunk.length;
      if (totalBytes > 0) {
        const percent = Math.floor((downloadedBytes / totalBytes) * 100);
        if (percent !== lastLogPercent && percent % 10 === 0) {
          lastLogPercent = percent;
          process.stdout.write(`\r[MediaPipe] Progress: ${percent}%`);
        }
      }
    });

    response.pipe(file);

    file.on('finish', () => {
      file.close(() => {
        const stat = fs.statSync(DEST_FILE);
        console.log(`\n[MediaPipe] ✓ Downloaded: ${DEST_FILE} (${(stat.size / 1024 / 1024).toFixed(1)} MB)`);
        console.log('[MediaPipe] Now run: npx expo run:android');
      });
    });
  }).on('error', (err) => {
    fs.unlink(DEST_FILE, () => {});
    console.error('[MediaPipe] Download error:', err.message);
    process.exit(1);
  });
}

download(MODEL_URL);
