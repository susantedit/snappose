import { Router, Request, Response } from 'express';
import { Template } from '../models/Template';
import { success, error } from '../utils/response';
import { optionalAuth, requireAuth, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

/**
 * GET /api/templates
 * Public discovery feed: retrieves public & approved templates with search, category filtering & pagination.
 */
router.get('/', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { category, search, vibe, page = '1', limit = '20' } = req.query;

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

    // Cache public response at edge/client for 2 minutes with stale-while-revalidate
    if (!req.headers.authorization) {
      res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
    }

    return res.json(
      success({
        templates,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      })
    );
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
    const trending = await Template.find({
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
      status: 'published',
    })
      .sort({ trendScore: -1, uses: -1, likes: -1 })
      .limit(10)
      .lean();

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

    Object.assign(existing, req.body);
    await existing.save();

    return res.json(success({ template: existing }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to update template'));
  }
});

/**
 * DELETE /api/templates/:id
 * Delete template (restricted to owner).
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
    return res.json(success({ deleted: true, id }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to delete template'));
  }
});

/**
 * POST /api/templates/:id/like
 * Increment likes on a template.
 */
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Template.findOneAndUpdate({ id }, { $inc: { likes: 1 } }, { new: true });
    return res.json(success({ likes: result?.likes ?? 0 }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to like template'));
  }
});

/**
 * POST /api/templates/:id/use
 * Increment usage counter.
 */
router.post('/:id/use', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Template.findOneAndUpdate(
      { id },
      { $inc: { uses: 1, trendScore: 2 } },
      { new: true }
    );
    return res.json(success({ uses: result?.uses ?? 0 }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to record usage'));
  }
});

/**
 * POST /api/templates/:id/remix
 * Record a remix action on a template.
 */
router.post('/:id/remix', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Template.findOneAndUpdate(
      { id },
      { $inc: { remixes: 1, trendScore: 3 } },
      { new: true }
    );
    return res.json(success({ remixes: result?.remixes ?? 0 }));
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to record remix'));
  }
});

/**
 * POST /api/templates/:id/report
 * Submit a moderation report for a template.
 */
router.post('/:id/report', optionalAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason, details } = req.body;

    if (!reason) {
      return res.status(400).json(error('VALIDATION_ERROR', 'Report reason is required'));
    }

    // Flag template if multiple reports arrive
    await Template.updateOne(
      { id },
      {
        $inc: { reportCount: 1 },
        $push: {
          reports: {
            reason,
            details: details || '',
            reportedAt: new Date(),
          },
        },
      }
    );

    return res.json(
      success({
        reported: true,
        id,
        message: 'Report received and queued for moderation review.',
      })
    );
  } catch (err: any) {
    return res.status(500).json(error('INTERNAL_ERROR', err?.message || 'Failed to submit report'));
  }
});

export default router;
