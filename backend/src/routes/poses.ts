import { Router, Request, Response } from 'express';
import { PoseModel } from '../models/Pose';
import { success, error } from '../utils/response';
import { routeCache, CACHE_TTL, makeCacheKey, generateETag } from '../utils/cache';

const router = Router();

// GET /poses (paginated, with search & filtering + in-memory TTL caching + ETag)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoryId, difficulty, orientation, indoor, keyword, limit = '20', cursor } = req.query;
    
    const cacheKey = makeCacheKey('poses', {
      categoryId,
      difficulty,
      orientation,
      indoor,
      keyword,
      limit,
      cursor,
    });

    const cachedData = routeCache.get<{
      items: unknown[];
      cursor?: string;
      hasMore: boolean;
      total: number;
    }>(cacheKey);

    if (cachedData) {
      const etag = generateETag(cachedData);
      res.setHeader('ETag', etag);
      res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');

      if (req.headers['if-none-match'] === etag) {
        res.status(304).end();
        return;
      }
      res.json(success(cachedData));
      return;
    }

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
      .sort({ createdAt: -1 })
      .lean();

    const hasMore = poses.length > pageSize;
    const items = hasMore ? poses.slice(0, pageSize) : poses;
    const nextCursor = hasMore && items.length > 0 ? (items[items.length - 1] as any).id : undefined;

    const total = await PoseModel.countDocuments(queryFilter);

    const payload = {
      items,
      cursor: nextCursor,
      hasMore,
      total,
    };

    // Store in TTL cache (5 min)
    routeCache.set(cacheKey, payload, CACHE_TTL.poses);

    const etag = generateETag(payload);
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');

    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }

    res.json(success(payload));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch poses'));
  }
});

// GET /poses/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = `pose:${req.params.id}`;
    const cachedPose = routeCache.get(cacheKey);

    if (cachedPose) {
      const etag = generateETag(cachedPose);
      res.setHeader('ETag', etag);
      if (req.headers['if-none-match'] === etag) {
        res.status(304).end();
        return;
      }
      res.json(success(cachedPose));
      return;
    }

    const pose = await PoseModel.findOne({ id: req.params.id }).lean();
    if (!pose) {
      res.status(404).json(error('NOT_FOUND', 'Pose not found'));
      return;
    }
    // Increment view count asynchronously
    PoseModel.updateOne({ id: req.params.id }, { $inc: { views: 1 } }).exec();

    routeCache.set(cacheKey, pose, CACHE_TTL.poses);

    const etag = generateETag(pose);
    res.setHeader('ETag', etag);

    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }

    res.json(success(pose));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch pose detail'));
  }
});

export default router;
