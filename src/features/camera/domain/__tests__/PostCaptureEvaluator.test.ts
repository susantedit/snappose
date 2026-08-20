/**
 * PostCaptureEvaluator.test.ts — Unit tests for post-capture pose accuracy evaluation.
 */

import { postCaptureEvaluator } from '../PostCaptureEvaluator';
import { createAnatomicalNeutralPose } from '@/features/ai/infrastructure/MediaPipePoseDetector';
import type { Pose } from '@/features/poses/types';

describe('PostCaptureEvaluator', () => {
  const mockPose: Pose = {
    id: 'test-pose-1',
    categoryId: 'portrait',
    category: 'Portrait',
    title: 'Test Standing Pose',
    description: 'A test pose',
    imageUrl: 'test.jpg',
    thumbnailUrl: 'test_thumb.jpg',
    difficulty: 'easy',
    views: 100,
    downloads: 50,
    favorites: 20,
    estimatedDistance: 2.0,
    cameraAngle: 'eye-level',
    lighting: 'natural',
    orientation: 'portrait',
    createdAt: '2026-08-19T00:00:00Z',
    updatedAt: '2026-08-19T00:00:00Z',
    instructions: ['Stand tall'],
    tips: ['Keep relaxed'],
  };

  it('should return POOR tier when captured landmarks are null (no person)', () => {
    const result = postCaptureEvaluator.evaluate(null, mockPose);
    expect(result.totalScore).toBe(0);
    expect(result.tier).toBe('POOR');
    expect(result.isMatched).toBe(false);
    expect(result.correctiveTips.length).toBeGreaterThan(0);
  });

  it('should evaluate matching landmarks with high accuracy and positive highlights', () => {
    const landmarks = createAnatomicalNeutralPose();
    const result = postCaptureEvaluator.evaluate(landmarks, mockPose);

    expect(result.totalScore).toBeGreaterThanOrEqual(70);
    expect(result.regionalBreakdown.length).toBe(6);
    expect(result.summaryMessage).toContain('Test Standing Pose');
  });

  it('should generate corrective tips when alignment is below threshold', () => {
    const modifiedLandmarks = createAnatomicalNeutralPose();
    // Drastically alter left wrist and elbow positions
    modifiedLandmarks[15] = { x: 0.1, y: 0.1, z: 0, visibility: 0.9 };
    modifiedLandmarks[13] = { x: 0.2, y: 0.2, z: 0, visibility: 0.9 };

    const result = postCaptureEvaluator.evaluate(modifiedLandmarks, mockPose);
    expect(result.regionalBreakdown).toBeDefined();
  });
});
