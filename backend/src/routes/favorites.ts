import { Router, Response } from 'express';
import { FavoriteModel } from '../models/Favorite';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { success, error } from '../utils/response';

const router = Router();

// GET /favorites
router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const favorites = await FavoriteModel.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
    const poseIds = favorites.map((f) => f.poseId);
    res.json(success(poseIds));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch favorites'));
  }
});

// POST /favorites (Add single favorite)
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { poseId } = req.body;
    if (!poseId) {
      res.status(400).json(error('INVALID_INPUT', 'poseId is required'));
      return;
    }

    await FavoriteModel.findOneAndUpdate(
      { userId: req.userId, poseId },
      { userId: req.userId, poseId },
      { upsert: true, new: true }
    );

    res.json(success({ poseId, isFavorite: true }));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to save favorite'));
  }
});

// POST /favorites/batch (Batch add/sync multiple favorites in a single roundtrip)
router.post('/batch', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { poseIds } = req.body;
    if (!Array.isArray(poseIds) || poseIds.length === 0) {
      res.status(400).json(error('INVALID_INPUT', 'poseIds array is required'));
      return;
    }

    // Cap batch size to prevent oversized statements
    const cappedPoseIds = poseIds.slice(0, 200);

    const bulkOps = cappedPoseIds.map((poseId: string) => ({
      updateOne: {
        filter: { userId: req.userId, poseId },
        update: { $setOnInsert: { userId: req.userId, poseId, createdAt: new Date() } },
        upsert: true,
      },
    }));

    await FavoriteModel.bulkWrite(bulkOps, { ordered: false });

    res.json(success({ syncedCount: cappedPoseIds.length, poseIds: cappedPoseIds }));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to batch save favorites'));
  }
});

// DELETE /favorites/:poseId (Remove from favorites)
router.delete('/:poseId', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { poseId } = req.params;
    await FavoriteModel.deleteOne({ userId: req.userId, poseId });
    res.json(success({ poseId, isFavorite: false }));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to remove favorite'));
  }
});

export default router;
