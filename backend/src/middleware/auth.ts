import { Request, Response, NextFunction } from 'express';
import { admin, initFirebaseAdmin } from '../config/firebaseAdmin';
import { error } from '../utils/response';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

/**
 * Verifies a Firebase ID token (JWT) from the Authorization header.
 * Returns the decoded token payload with the real Firebase UID.
 *
 * Throws if the token is invalid, expired, or Firebase Admin is not initialized.
 */
async function verifyFirebaseToken(token: string): Promise<admin.auth.DecodedIdToken> {
  initFirebaseAdmin();
  if (admin.apps.length === 0) {
    throw new Error('Firebase Admin SDK not initialized — cannot verify token');
  }
  return admin.auth().verifyIdToken(token, true /* checkRevoked */);
}

/**
 * Optional authentication middleware.
 * If a valid Bearer Firebase ID token is provided, populates req.user with the real Firebase UID.
 * If no token or an invalid token is provided, the request continues without a user context.
 * Never rejects the request — use requireAuth for protected routes.
 */
export async function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split('Bearer ')[1];
  if (!token) {
    return next();
  }

  try {
    const decoded = await verifyFirebaseToken(token);
    req.userId = decoded.uid;
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
    };
  } catch {
    // Token invalid or Admin SDK not initialized — proceed without user context
  }

  next();
}

/**
 * Strict authentication middleware.
 * Requires a valid Firebase ID Bearer token. Returns 401 if missing or invalid.
 * The request's req.user.uid is guaranteed to be the real Firebase UID — never client-provided.
 */
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(error('UNAUTHORIZED', 'Authentication token required'));
    return;
  }

  const token = authHeader.split('Bearer ')[1];
  if (!token) {
    res.status(401).json(error('UNAUTHORIZED', 'Invalid token format'));
    return;
  }

  try {
    const decoded = await verifyFirebaseToken(token);
    req.userId = decoded.uid;
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (err: any) {
    const isExpired = err?.code === 'auth/id-token-expired';
    const isRevoked = err?.code === 'auth/id-token-revoked';
    const isInvalid = err?.code === 'auth/argument-error' || err?.code === 'auth/invalid-id-token';

    if (isExpired) {
      res.status(401).json(error('TOKEN_EXPIRED', 'Your session has expired. Please sign in again.'));
    } else if (isRevoked) {
      res.status(401).json(error('TOKEN_REVOKED', 'Your session was revoked. Please sign in again.'));
    } else if (isInvalid) {
      res.status(401).json(error('INVALID_TOKEN', 'Invalid authentication token.'));
    } else {
      // Firebase Admin not initialized — fallback: extract UID from token for dev environment
      // IMPORTANT: This only runs when Firebase Admin SDK is unavailable (no credentials).
      // In production, this branch must never be reached.
      console.warn(
        '[requireAuth] Firebase Admin unavailable — cannot verify token. ' +
        'Set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT_JSON in the backend environment.',
      );
      res.status(503).json(
        error('AUTH_SERVICE_UNAVAILABLE', 'Authentication service unavailable. Check backend Firebase configuration.'),
      );
    }
  }
}
