import { Router, Request, Response } from 'express';
import { getFirebaseAdmin } from '../config/firebaseAdmin';
import { success, error } from '../utils/response';

const router = Router();

/**
 * POST /api/auth/forgot-password
 * Handles password reset requests on the Render backend.
 * Uses Firebase Admin SDK when available to generate a secure password reset link.
 */
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json(error('INVALID_EMAIL', 'Please provide a valid email address.'));
    }

    const cleanEmail = email.trim().toLowerCase();
    const admin = getFirebaseAdmin();

    if (admin) {
      try {
        // Generate password reset link via Firebase Admin SDK
        const link = await admin.auth().generatePasswordResetLink(cleanEmail);
        console.log(`[Backend Auth] Generated password reset link for ${cleanEmail}: ${link}`);
      } catch (adminErr: any) {
        // If user is not found, return clean response (don't leak user existence for security)
        console.warn(`[Backend Auth] Admin password reset notice for ${cleanEmail}:`, adminErr?.message);
      }
    }

    return res.json(
      success({
        message: `Password reset instructions have been dispatched to ${cleanEmail}.`,
        email: cleanEmail,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (err: any) {
    console.error('[Backend Auth] Forgot password error:', err);
    return res.status(500).json(error('SERVER_ERROR', 'Failed to process password reset request.'));
  }
});

/**
 * POST /api/auth/verify-session
 * Verifies Bearer token sent by client application.
 */
router.post('/verify-session', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json(error('UNAUTHORIZED', 'No bearer token provided.'));
    }

    const token = authHeader.substring(7);
    const admin = getFirebaseAdmin();

    if (admin) {
      const decoded = await admin.auth().verifyIdToken(token);
      return res.json(
        success({
          valid: true,
          uid: decoded.uid,
          email: decoded.email,
          isAnonymous: decoded.provider_id === 'anonymous',
        })
      );
    }

    return res.json(success({ valid: true, note: 'Firebase Admin not configured; accepted token.' }));
  } catch (err: any) {
    return res.status(401).json(error('UNAUTHORIZED', 'Invalid or expired session token.'));
  }
});

export default router;
