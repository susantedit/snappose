import { extractStaticPoseLandmarks } from '../StaticLandmarkExtractor';
import { getReferenceSkeletonForKey } from '../../domain/PoseScoreCalculator';

describe('StaticLandmarkExtractor', () => {
  const sampleSkeleton = getReferenceSkeletonForKey('WALKING_CASUAL');

  it('throws error when imageUri is empty', async () => {
    await expect(extractStaticPoseLandmarks('')).rejects.toThrow(
      'Image URI is required for landmark extraction.',
    );
  });

  it('returns success: false and NO_PERSON when image has no landmark data', async () => {
    const result = await extractStaticPoseLandmarks('file:///test/image.jpg', {
      category: 'street',
      difficulty: 'medium',
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe('NO_PERSON');
    expect(result.landmarks).toBeNull();
    expect(result.confidence).toBe(0);
  });

  it('correctly processes genuine static pose landmarks when provided', async () => {
    const result = await extractStaticPoseLandmarks('file:///test/valid_pose.jpg', {
      category: 'street',
      difficulty: 'medium',
      rawLandmarks: sampleSkeleton,
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('REAL_LANDMARKS');
    expect(result.landmarkCount).toBe(33);
    expect(result.landmarks).toHaveLength(33);
    expect(result.confidence).toBeGreaterThan(0.9);
    expect(result.normalised).not.toBeNull();
    expect(result.normalised?.referenceScale).toBeGreaterThan(0.1);
  });
});

