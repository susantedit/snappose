import { Router, Request, Response } from 'express';
import { CategoryModel } from '../models/Category';
import { success, error } from '../utils/response';
import { routeCache, CACHE_TTL, generateETag } from '../utils/cache';

const router = Router();

// GET /categories (with 10-minute TTL caching & ETag)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const cacheKey = 'categories:all';
    const cached = routeCache.get(cacheKey);

    if (cached) {
      const etag = generateETag(cached);
      res.setHeader('ETag', etag);
      res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=1200');

      if (req.headers['if-none-match'] === etag) {
        res.status(304).end();
        return;
      }
      res.json(success(cached));
      return;
    }

    const categories = await CategoryModel.find().sort({ sortOrder: 1, name: 1 }).lean();
    routeCache.set(cacheKey, categories, CACHE_TTL.categories);

    const etag = generateETag(categories);
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 'public, max-age=600, stale-while-revalidate=1200');

    if (req.headers['if-none-match'] === etag) {
      res.status(304).end();
      return;
    }

    res.json(success(categories));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch categories'));
  }
});

export default router;
