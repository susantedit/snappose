import { extractStaticPoseLandmarks } from '../StaticLandmarkExtractor';

describe('StaticLandmarkExtractor', () => {
  it('throws error when imageUri is empty', async () => {
    await expect(extractStaticPoseLandmarks('')).rejects.toThrow(
      'Image URI is required for landmark extraction.',
    );
  });

  it('extracts exactly 33 landmarks for a standing pose', async () => {
    const result = await extractStaticPoseLandmarks('file:///test/image.jpg', {
      category: 'street',
      difficulty: 'medium',
    });

    expect(result.success).toBe(true);
    expect(result.landmarkCount).toBe(33);
    expect(result.landmarks).toHaveLength(33);
    expect(result.detectedPoseType).toBe('standing');
    expect(result.confidence).toBeGreaterThan(0.9);

    // Verify all 33 coordinates are within [0, 1] range
    for (const lm of result.landmarks) {
      expect(lm.x).toBeGreaterThanOrEqual(0);
      expect(lm.x).toBeLessThanOrEqual(1);
      expect(lm.y).toBeGreaterThanOrEqual(0);
      expect(lm.y).toBeLessThanOrEqual(1);
      expect(lm.visibility).toBeGreaterThan(0.8);
    }
  });

  it('adapts posture topology for sitting/cafe categories', async () => {
    const result = await extractStaticPoseLandmarks('file:///test/cafe.jpg', {
      category: 'cafe',
      difficulty: 'easy',
    });

    expect(result.success).toBe(true);
    expect(result.detectedPoseType).toBe('sitting');
    // Knees (25, 26) in sitting pose should have different relative coordinates
    expect(result.landmarks[25].y).toBeGreaterThan(result.landmarks[11].y); // knee below shoulder
  });

  it('computes positive reference scale from shoulders to hips', async () => {
    const result = await extractStaticPoseLandmarks('file:///test/portrait.jpg', {
      category: 'portrait',
    });

    expect(result.normalised.referenceScale).toBeGreaterThan(0.1);
  });
});
