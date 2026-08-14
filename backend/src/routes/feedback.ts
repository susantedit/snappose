import { Router, Response } from 'express';
import { FeedbackModel } from '../models/Feedback';
import { optionalAuth, AuthenticatedRequest } from '../middleware/auth';
import { success, error } from '../utils/response';

const router = Router();

// POST /feedback
router.post('/', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, type = 'feedback' } = req.body;
    if (!message) {
      res.status(400).json(error('INVALID_INPUT', 'Message is required'));
      return;
    }

    const feedback = await FeedbackModel.create({
      userId: req.userId || 'anonymous',
      type,
      message,
    });

    res.json(success(feedback));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to submit feedback'));
  }
});

export default router;
