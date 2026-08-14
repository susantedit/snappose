import { Router, Request, Response } from 'express';
import { PoseModel } from '../models/Pose';
import { success, error } from '../utils/response';

const router = Router();

// GET /poses (paginated, with search & filtering)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId, difficulty, orientation, indoor, keyword, limit = '20', cursor } = req.query;
    const queryFilter: Record<string, unknown> = {};

    if (categoryId) queryFilter.categoryId = categoryId;
    if (difficulty) queryFilter.difficulty = difficulty;
    if (orientation) queryFilter.orientation = orientation;
    if (indoor !== undefined) queryFilter.indoor = indoor === 'true';
    if (keyword) {
      queryFilter.$or = [
        { title: { $regex: String(keyword), $options: 'i' } },
        { tags: { $in: [new RegExp(String(keyword), 'i')] } },
      ];
    }
    if (cursor) {
      queryFilter.id = { $gt: String(cursor) };
    }

    const pageSize = Math.min(parseInt(String(limit), 10) || 20, 50);
    const poses = await PoseModel.find(queryFilter)
      .limit(pageSize + 1)
      .sort({ createdAt: -1 });

    const hasMore = poses.length > pageSize;
    const items = hasMore ? poses.slice(0, pageSize) : poses;
    const nextCursor = hasMore && items.length > 0 ? items[items.length - 1].id : undefined;

    const total = await PoseModel.countDocuments(queryFilter);

    res.json(
      success({
        items,
        cursor: nextCursor,
        hasMore,
        total,
      })
    );
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch poses'));
  }
});

// GET /poses/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const pose = await PoseModel.findOne({ id: req.params.id });
    if (!pose) {
      res.status(404).json(error('NOT_FOUND', 'Pose not found'));
      return;
    }
    // Increment view count asynchronously
    PoseModel.updateOne({ id: req.params.id }, { $inc: { views: 1 } }).exec();

    res.json(success(pose));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch pose detail'));
  }
});

export default router;
