/**
 * CinematicPoses.test.ts — Verification of original Cinematic Sci-Fi and Men's pose datasets.
 */

import { SNAP_POSE_DATASET, SNAP_POSE_CATEGORIES } from '../posesData';

describe('Cinematic & Men Poses Dataset', () => {
  it('should include cinematic and men categories in SNAP_POSE_CATEGORIES', () => {
    const cinematicCat = SNAP_POSE_CATEGORIES.find((c) => c.id === 'cinematic');
    const menCat = SNAP_POSE_CATEGORIES.find((c) => c.id === 'men');

    expect(cinematicCat).toBeDefined();
    expect(cinematicCat?.name).toContain('Cinematic');
    expect(menCat).toBeDefined();
    expect(menCat?.name).toContain('Men');
  });

  it('should include original cinematic character-inspired poses', () => {
    const jediPose = SNAP_POSE_DATASET.find((p) => p.id === 'pose-jedi-hero-stance');
    const lightsaberPose = SNAP_POSE_DATASET.find((p) => p.id === 'pose-lightsaber-duel-stance');
    const darkVillainPose = SNAP_POSE_DATASET.find((p) => p.id === 'pose-dark-villain-power-stance');
    const obiWanPose = SNAP_POSE_DATASET.find((p) => p.id === 'pose-obi-wan-defensive-guard');
    const anakinPose = SNAP_POSE_DATASET.find((p) => p.id === 'pose-anakin-hero-landing');

    expect(jediPose).toBeDefined();
    expect(jediPose?.instructions.length).toBeGreaterThan(0);
    expect(lightsaberPose).toBeDefined();
    expect(darkVillainPose).toBeDefined();
    expect(obiWanPose).toBeDefined();
    expect(anakinPose).toBeDefined();
  });

  it('should include men photography collection poses', () => {
    const streetwearPose = SNAP_POSE_DATASET.find((p) => p.id === 'pose-men-streetwear-oversized');
    const luxuryWatchPose = SNAP_POSE_DATASET.find((p) => p.id === 'pose-men-luxury-watch-cuff');

    expect(streetwearPose).toBeDefined();
    expect(streetwearPose?.categoryId).toBe('men');
    expect(luxuryWatchPose).toBeDefined();
    expect(luxuryWatchPose?.categoryId).toBe('men');
  });
});
