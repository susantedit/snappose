import { Router, Response } from 'express';
import { UserModel } from '../models/User';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { success, error } from '../utils/response';

const router = Router();

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const BASE_LIMIT = 10;

// GET /captures/stats
router.get('/stats', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    let user = await UserModel.findOne({ uid: req.userId });
    if (!user) {
      user = await UserModel.create({
        uid: req.userId,
        isAnonymous: true,
        captureStats: {
          totalCaptures: 0,
          windowStartTime: Date.now(),
          windowCaptureCount: 0,
          bonusCaptures: 0,
        },
      });
    }

    const now = Date.now();
    // Check rolling 6-hour window reset
    if (now - user.captureStats.windowStartTime >= SIX_HOURS_MS) {
      user.captureStats.windowStartTime = now;
      user.captureStats.windowCaptureCount = 0;
      user.captureStats.bonusCaptures = 0;
      await user.save();
    }

    const maxAllowed = BASE_LIMIT + user.captureStats.bonusCaptures;
    const remaining = Math.max(0, maxAllowed - user.captureStats.windowCaptureCount);
    const resetTime = user.captureStats.windowStartTime + SIX_HOURS_MS;

    res.json(
      success({
        count: user.captureStats.windowCaptureCount,
        maxAllowed,
        remaining,
        bonusCaptures: user.captureStats.bonusCaptures,
        windowResetTime: resetTime,
        isLimitReached: remaining <= 0,
      })
    );
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch capture stats'));
  }
});

// POST /captures (record a photo capture)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    let user = await UserModel.findOne({ uid: req.userId });
    if (!user) {
      user = await UserModel.create({ uid: req.userId, isAnonymous: true });
    }

    const now = Date.now();
    if (now - user.captureStats.windowStartTime >= SIX_HOURS_MS) {
      user.captureStats.windowStartTime = now;
      user.captureStats.windowCaptureCount = 0;
      user.captureStats.bonusCaptures = 0;
    }

    const maxAllowed = BASE_LIMIT + user.captureStats.bonusCaptures;
    if (user.captureStats.windowCaptureCount >= maxAllowed) {
      res.status(429).json(error('LIMIT_EXCEEDED', 'Rolling 6-hour photo capture limit reached'));
      return;
    }

    user.captureStats.windowCaptureCount += 1;
    user.captureStats.totalCaptures += 1;
    await user.save();

    res.json(
      success({
        captured: true,
        count: user.captureStats.windowCaptureCount,
        remaining: maxAllowed - user.captureStats.windowCaptureCount,
      })
    );
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to record photo capture'));
  }
});

// POST /captures/bonus (rewarded ad completion -> grant +5 bonus captures)
router.post('/bonus', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    let user = await UserModel.findOne({ uid: req.userId });
    if (!user) {
      user = await UserModel.create({ uid: req.userId, isAnonymous: true });
    }

    const now = Date.now();
    if (now - user.captureStats.windowStartTime >= SIX_HOURS_MS) {
      user.captureStats.windowStartTime = now;
      user.captureStats.windowCaptureCount = 0;
      user.captureStats.bonusCaptures = 0;
    }

    user.captureStats.bonusCaptures += 5;
    await user.save();

    const maxAllowed = BASE_LIMIT + user.captureStats.bonusCaptures;
    const remaining = Math.max(0, maxAllowed - user.captureStats.windowCaptureCount);

    res.json(
      success({
        granted: 5,
        totalBonus: user.captureStats.bonusCaptures,
        maxAllowed,
        remaining,
      })
    );
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to grant bonus captures'));
  }
});

export default router;
