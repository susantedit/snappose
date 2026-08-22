import { Router, Request, Response } from 'express';
import { PoseModel } from '../models/Pose';
import { success, error } from '../utils/response';

const router = Router();

// POST /ai/semantic-search (Natural language semantic query matching)
router.post('/semantic-search', async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json(error('INVALID_INPUT', 'Please provide a search prompt'));
      return;
    }

    const clean = prompt.toLowerCase();

    // Check if query is photography / pose / camera related
    const PHOTO_KEYWORDS = [
      'pose', 'photo', 'camera', 'picture', 'angle', 'shot', 'portrait', 'lighting',
      'model', 'outfit', 'background', 'selfie', 'street', 'cafe', 'nature', 'trek',
      'beach', 'formal', 'casual', 'sitting', 'standing', 'lean', 'hands', 'arm', 'leg',
      'shoulder', 'head', 'face', 'sunset', 'golden hour', 'framing', 'lens', 'aesthetic',
      'style', 'filter', 'preset', 'composition', 'shadow', 'flash', 'studio', 'glamour',
    ];

    const isPhotoRelated = PHOTO_KEYWORDS.some((kw) => clean.includes(kw)) || clean.length < 5;

    if (!isPhotoRelated) {
      res.status(400).json(
        error(
          'OUT_OF_SCOPE',
          'Sorry, I am your POSEHANUM AI Photography Assistant. I can only assist with photography, pose ideas, camera angles, lighting, and visual styling.',
        ),
      );
      return;
    }

    const words = clean.split(/\s+/).filter((w) => w.length > 2);

    // MongoDB regex search matching title, tags, or description
    const regexList = words.map((w) => new RegExp(w, 'i'));
    const poses = await PoseModel.find({
      $or: [
        { title: { $in: regexList } },
        { tags: { $in: regexList } },
        { categoryId: { $in: regexList } },
      ],
    })
      .limit(15)
      .lean();

    const results = poses.map((pose) => ({
      pose,
      matchScore: 88,
      aiReason: `Matched context for "${prompt}"`,
      directorTip: `Align posture with ${pose.title} guide`,
    }));

    res.json(
      success({
        prompt,
        results,
        aiOverview: `Found ${results.length} matching photography references for your prompt.`,
      })
    );
  } catch (err) {
    res.status(500).json(error('AI_SEARCH_ERROR', 'Failed to process AI semantic query'));
  }
});

// POST /ai/director-coach (Live AI director advice)
router.post('/director-coach', (req: Request, res: Response): void => {
  try {
    const { score, lighting } = req.body;

    const numericScore = typeof score === 'number' ? score : 50;
    let coaching = 'Hold your phone at chest level and step back.';
    if (numericScore > 85) {
      coaching = 'Perfect posture! Maintain steady eye contact with lens.';
    } else if (numericScore > 65) {
      coaching = 'Lift chin up 5 degrees and square shoulders with camera.';
    }

    res.json(
      success({
        headline: numericScore > 85 ? 'Excellent Alignment' : 'Adjusting Stance',
        coaching,
        lightingGuidance: lighting || 'Natural directional light recommended.',
      })
    );
  } catch (err) {
    res.status(500).json(error('DIRECTOR_ERROR', 'Failed to generate director advice'));
  }
});

export default router;
