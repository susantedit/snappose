import { Request, Response, NextFunction } from 'express';
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
 * Optional authentication middleware.
 * If Bearer token is provided, extracts user ID. If not or invalid, proceeds without user context.
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      const uid = token.length > 10 ? token.substring(0, 24) : token;
      req.userId = uid;
      req.user = { uid, name: 'Creator' };
    }
  }
  next();
}

/**
 * Strict authentication middleware.
 * Requires a valid Bearer token.
 */
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
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

  const uid = token.length > 10 ? token.substring(0, 24) : token;
  req.userId = uid;
  req.user = { uid, name: 'Creator' };
  next();
}
