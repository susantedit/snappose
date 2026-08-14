import { Router, Request, Response } from 'express';
import { AppConfigModel } from '../models/AppConfig';
import { success, error } from '../utils/response';

const router = Router();

// GET /app-config
router.get('/', async (_req: Request, res: Response) => {
  try {
    let config = await AppConfigModel.findOne({ key: 'global' });
    if (!config) {
      config = await AppConfigModel.create({
        key: 'global',
        maintenanceMode: false,
        minimumVersion: '1.0.0',
        latestVersion: '1.0.0',
        adsEnabled: true,
        autoCaptureThreshold: 94,
        voiceGuidanceEnabled: true,
      });
    }
    res.json(success(config));
  } catch (err) {
    res.status(500).json(error('INTERNAL_ERROR', 'Failed to fetch app configuration'));
  }
});

export default router;
