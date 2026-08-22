/**
 * Firebase Admin SDK initialization for the backend.
 * Uses service account credentials from environment or the bundled JSON file.
 */

import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

let initialized = false;

export function initFirebaseAdmin(): void {
  if (initialized || admin.apps.length > 0) {
    initialized = true;
    return;
  }

  try {
    // 1. Prefer GOOGLE_APPLICATION_CREDENTIALS env var (standard GCP pattern)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      initialized = true;
      console.log('[FirebaseAdmin] Initialized via GOOGLE_APPLICATION_CREDENTIALS');
      return;
    }

    // 2. Prefer FIREBASE_SERVICE_ACCOUNT_JSON env var (inline JSON secret, for cloud hosts)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      initialized = true;
      console.log('[FirebaseAdmin] Initialized via FIREBASE_SERVICE_ACCOUNT_JSON env var');
      return;
    }

    // 3. Fall back to bundled service account JSON in the repo root
    const serviceAccountPath = path.resolve(
      __dirname,
      '../../../snap-pose-c16f4-firebase-adminsdk-fbsvc-682246584b.json',
    );

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      initialized = true;
      console.log('[FirebaseAdmin] Initialized via bundled service account JSON');
      return;
    }

    console.warn(
      '[FirebaseAdmin] WARNING: No Firebase credentials found. ' +
      'Set GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_SERVICE_ACCOUNT_JSON, or place the service account JSON in the repo root. ' +
      'Auth middleware will reject all protected requests.',
    );
  } catch (err) {
    console.error('[FirebaseAdmin] Initialization error:', err);
  }
}

export { admin };
