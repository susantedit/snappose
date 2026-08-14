import { Router, Request, Response } from 'express';
import { CategoryModel } from '../models/Category';
import { success, error } from '../utils/response';

const router = Router();

// GET /categories
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await CategoryModel.find().sort({ sortOrder: 1, name: 1 });
    res.json(success(categories));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch categories'));
  }
});

export default router;
