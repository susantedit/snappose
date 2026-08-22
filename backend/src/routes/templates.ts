import { Router, Request, Response } from 'express';
import { Template } from '../models/Template';
import { success, error } from '../utils/response';
import { optionalAuth, requireAuth, AuthenticatedRequest } from '../middleware/auth';
import { routeCache, CACHE_TTL, makeCacheKey, generateETag } from '../utils/cache';

const router = Router();

/**
 * GET /api/templates
 * Public discovery feed: retrieves public & approved templates with search, category filtering & pagination.
 */
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { category, search, vibe, page = '1', limit = '20' } = req.query;

    const isPublicQuery = !req.headers.authorization;
    const cacheKey = makeCacheKey('templates', { category, search, vibe, page, limit });

    if (isPublicQuery) {
      const cached = routeCache.get<any>(cacheKey);
      if (cached) {
        const etag = generateETag(cached);
        res.setHeader('ETag', etag);
        res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
        if (req.headers['if-none-match'] === etag) {
          return res.status(304).end();
        }
        return res.json(success(cached));
      }
    }

    const query: Record<string, unknown> = {
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
      status: 'published',
    };

    if (category && category !== 'all') {
      query.category = String(category).toLowerCase();
    }

    if (vibe && vibe !== 'all') {
      query['shotRecipe.expression'] = new RegExp(String(vibe), 'i');
    }

    if (search && String(search).trim()) {
      const searchRegex = new RegExp(String(search).trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { creatorName: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit), 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [templates, total] = await Promise.all([
      Template.find(query).sort({ trendScore: -1, createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Template.countDocuments(query),
    ]);

    const resultPayload = {
      templates,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    };

    if (isPublicQuery) {
      routeCache.set(cacheKey, resultPayload, CACHE_TTL.templates);
      const etag = generateETag(resultPayload);
      res.setHeader('ETag', etag);
      res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');

      if (req.headers['if-none-match'] === etag) {
        return res.status(304).end();
      }
    }

    return res.json(success(resultPayload));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to fetch templates'));
  }
});

/**
 * GET /api/templates/trending
 * Returns top-trending templates ranked by usage, likes, and velocity.
 */
router.get('/trending', async (_req: Request, res: Response) => {
  try {
    const cacheKey = 'templates:trending';
    const cached = routeCache.get<any>(cacheKey);
    if (cached) {
      return res.json(success({ templates: cached }));
    }

    const trending = await Template.find({
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
      status: 'published',
    })
      .sort({ trendScore: -1, uses: -1, likes: -1 })
      .limit(10)
      .lean();

    routeCache.set(cacheKey, trending, CACHE_TTL.templates);

    return res.json(success({ templates: trending }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to fetch trending templates'));
  }
});

/**
 * GET /api/templates/:id
 * Retrieve a specific template by ID.
 */
router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const template = await Template.findOne({ id }).lean();

    if (!template) {
      return res.status(404).json(error('NOT_FOUND', `Template with id "${id}" not found`));
    }

    // Increment view count asynchronously
    Template.updateOne({ id }, { $inc: { views: 1 } }).exec();

    return res.json(success({ template }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to fetch template'));
  }
});

/**
 * POST /api/templates
 * Create and publish a new template.
 */
router.post('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const creatorUid = req.user?.uid || 'anonymous';
    const creatorName = req.user?.name || req.body.creatorName || 'POSEHANUM Creator';
    const payload = req.body;

    if (!payload.title || !payload.thumbnail || !payload.category) {
      return res.status(400).json(error('VALIDATION_ERROR', 'title, thumbnail, and category are required.'));
    }

    const templateId = payload.id || `tpl-user-${Date.now()}`;

    const newTemplate = await Template.create({
      ...payload,
      id: templateId,
      creatorId: creatorUid,
      creatorName,
      status: 'published',
      moderationStatus: 'APPROVED',
      visibility: payload.visibility || 'PUBLIC',
    });

    // Invalidate cached templates list
    routeCache.invalidatePrefix('templates');

    return res.status(201).json(success({ template: newTemplate }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to create template'));
  }
});

/**
 * PUT /api/templates/:id
 * Update template (restricted to owner).
 */
router.put('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const creatorUid = req.user?.uid;

    const existing = await Template.findOne({ id });
    if (!existing) {
      return res.status(404).json(error('NOT_FOUND', 'Template not found'));
    }

    if (existing.creatorId !== creatorUid) {
      return res.status(403).json(error('FORBIDDEN', 'You can only edit your own templates.'));
    }

    const updated = await Template.findOneAndUpdate(
      { id },
      { $set: { ...req.body, updatedAt: new Date() } },
      { new: true }
    );

    routeCache.invalidatePrefix('templates');

    return res.json(success({ template: updated }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to update template'));
  }
});

/**
 * DELETE /api/templates/:id
 * Delete a template (restricted to owner).
 */
router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const creatorUid = req.user?.uid;

    const existing = await Template.findOne({ id });
    if (!existing) {
      return res.status(404).json(error('NOT_FOUND', 'Template not found'));
    }

    if (existing.creatorId !== creatorUid) {
      return res.status(403).json(error('FORBIDDEN', 'You can only delete your own templates.'));
    }

    await Template.deleteOne({ id });
    routeCache.invalidatePrefix('templates');

    return res.json(success({ deleted: true, id }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to delete template'));
  }
});

/**
 * POST /api/templates/:id/like
 * Increment like counter.
 */
router.post('/:id/like', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Template.updateOne({ id }, { $inc: { likes: 1, trendScore: 2 } });
    return res.json(success({ liked: true }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to like template'));
  }
});

/**
 * POST /api/templates/:id/use
 * Increment usage counter.
 */
router.post('/:id/use', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Template.updateOne({ id }, { $inc: { uses: 1, trendScore: 5 } });
    return res.json(success({ used: true }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to record template use'));
  }
});

/**
 * POST /api/templates/:id/remix
 * Increment remix counter.
 */
router.post('/:id/remix', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Template.updateOne({ id }, { $inc: { remixes: 1, trendScore: 10 } });
    return res.json(success({ remixed: true }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to record remix'));
  }
});

/**
 * POST /api/templates/:id/report
 * Report a template for content moderation.
 */
router.post('/:id/report', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, details } = req.body;

    if (!reason) {
      return res.status(400).json(error('VALIDATION_ERROR', 'reason is required'));
    }

    const template = await Template.findOne({ id });
    if (!template) {
      return res.status(404).json(error('NOT_FOUND', 'Template not found'));
    }

    template.reportCount = (template.reportCount || 0) + 1;
    if (template.reportCount >= 3) {
      template.moderationStatus = 'REJECTED';
    }
    await template.save();

    return res.json(success({ reported: true, templateId: id, reason, details }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to report template'));
  }
});

export default router;
