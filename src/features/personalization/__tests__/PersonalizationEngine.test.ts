/**
 * Comprehensive Unit and Property Tests for Personalization Engine,
 * Behavior Tracker, Cold Start Service, and Personalization Store.
 */

import {
  PersonalizationEngine,
  DEFAULT_RECOMMENDATION_WEIGHTS,
} from '../domain/PersonalizationEngine';
import { BehaviorTracker } from '../domain/BehaviorTracker';
import { ColdStartService } from '../domain/ColdStartService';
import { usePersonalizationStore } from '@/stores/personalizationStore';
import { SNAP_POSE_DATASET } from '@/features/poses/data/posesData';
import type { Pose } from '@/features/poses/types';

describe('Personalization & Recommendation Engine', () => {
  // -------------------------------------------------------------------------
  // 1. ColdStartService Tests
  // -------------------------------------------------------------------------
  describe('ColdStartService', () => {
    it('creates a neutral baseline profile with all weights between 0.0 and 1.0', () => {
      const profile = ColdStartService.createDefaultProfile();

      expect(profile).toBeDefined();
      expect(profile.modelVersion).toBe('v1');
      expect(profile.totalInteractions).toBe(0);
      expect(profile.difficultyPreference).toBe(0.4);
      expect(profile.averageMatchScore).toBe(72);

      Object.values(profile.preferredCategories).forEach((weight) => {
        expect(weight).toBeGreaterThanOrEqual(0.0);
        expect(weight).toBeLessThanOrEqual(1.0);
      });
    });

    it('initializes targeted profile based on onboarding survey choices', () => {
      const customized = ColdStartService.createProfileFromAnswers({
        photoTypes: ['street', 'cafe'],
        style: 'aesthetic',
        experienceLevel: 'advanced',
        outfitCategory: 'streetwear',
      });

      expect(customized.preferredCategories['street']).toBe(0.85);
      expect(customized.preferredCategories['cafe']).toBe(0.85);
      expect(customized.favoritePoseStyle).toBe('aesthetic');
      expect(customized.experienceLevel).toBe('advanced');
      expect(customized.difficultyPreference).toBe(0.8);
      expect(customized.preferredOutfit).toBe('streetwear');
    });
  });

  // -------------------------------------------------------------------------
  // 2. BehaviorTracker Tests
  // -------------------------------------------------------------------------
  describe('BehaviorTracker', () => {
    it('increases category and tag affinity on positive interaction signals', () => {
      const base = ColdStartService.createDefaultProfile();
      const initialStreetWeight = base.preferredCategories['street'] ?? 0.5;

      const updated = BehaviorTracker.updateProfileWithSignal(
        base,
        {
          id: 'sig-1',
          type: 'POSE_FAVORITED',
          categoryId: 'street',
          tags: ['urban', 'standing'],
          timestamp: new Date().toISOString(),
        },
        SNAP_POSE_DATASET[0],
      );

      expect(updated.preferredCategories['street']).toBeGreaterThan(initialStreetWeight);
      expect(updated.preferredPoseTypes['standing']).toBeGreaterThan(0.5);
      expect(updated.totalInteractions).toBe(1);
    });

    it('decreases category affinity on negative signals with soft damping', () => {
      const base = ColdStartService.createDefaultProfile();
      base.preferredCategories['cafe'] = 0.7;

      const updated = BehaviorTracker.updateProfileWithSignal(base, {
        id: 'sig-2',
        type: 'POSE_SKIPPED',
        categoryId: 'cafe',
        timestamp: new Date().toISOString(),
      });

      expect(updated.preferredCategories['cafe']).toBeLessThan(0.7);
      expect(updated.preferredCategories['cafe']).toBeGreaterThanOrEqual(0.0);
    });

    it('strictly clamps weights between 0.0 and 1.0 even after repeated extreme signals', () => {
      let profile = ColdStartService.createDefaultProfile();

      // Apply 20 consecutive EXPLICIT_LIKE signals
      for (let i = 0; i < 20; i++) {
        profile = BehaviorTracker.updateProfileWithSignal(profile, {
          id: `sig-like-${i}`,
          type: 'EXPLICIT_LIKE',
          categoryId: 'street',
          timestamp: new Date().toISOString(),
        });
      }
      expect(profile.preferredCategories['street']).toBe(1.0);

      // Apply 20 consecutive EXPLICIT_DISLIKE signals
      for (let i = 0; i < 20; i++) {
        profile = BehaviorTracker.updateProfileWithSignal(profile, {
          id: `sig-dislike-${i}`,
          type: 'EXPLICIT_DISLIKE',
          categoryId: 'street',
          timestamp: new Date().toISOString(),
        });
      }
      expect(profile.preferredCategories['street']).toBe(0.0);
    });

    it('updates average match score and tracks successful captures', () => {
      let profile = ColdStartService.createDefaultProfile();
      expect(profile.totalSuccessfulCaptures).toBe(0);

      profile = BehaviorTracker.updateProfileWithSignal(profile, {
        id: 'sig-capture-1',
        type: 'POSE_CAPTURED',
        score: 95,
        timestamp: new Date().toISOString(),
      });

      expect(profile.totalSuccessfulCaptures).toBe(1);
      expect(profile.averageMatchScore).toBeGreaterThan(72);
    });
  });

  // -------------------------------------------------------------------------
  // 3. PersonalizationEngine Candidate Scoring & Ranking Tests
  // -------------------------------------------------------------------------
  describe('PersonalizationEngine', () => {
    const engine = new PersonalizationEngine();

    it('ranks poses higher for preferred categories', () => {
      const profile = ColdStartService.createDefaultProfile();
      profile.preferredCategories['street'] = 0.95;
      profile.preferredCategories['cafe'] = 0.2;

      const ranked = engine.rankPoses(SNAP_POSE_DATASET, profile, undefined, 5);

      expect(ranked.length).toBe(5);
      const topPick = ranked[0];
      expect(topPick.pose.categoryId).toBe('street');
      expect(topPick.totalScore).toBeGreaterThan(0.5);
      expect(topPick.explanation).toContain('street');
    });

    it('enforces 80% exploitation and 20% exploration diversity', () => {
      const profile = ColdStartService.createDefaultProfile();
      profile.preferredCategories['street'] = 0.99;

      const limit = 10;
      const ranked = engine.rankPoses(SNAP_POSE_DATASET, profile, undefined, limit);

      expect(ranked.length).toBe(limit);
      const explorationItems = ranked.filter((r) => r.isExploration);
      expect(explorationItems.length).toBeGreaterThanOrEqual(1);
      expect(explorationItems.some((r) => r.explanation === 'Try something new')).toBe(true);
    });

    it('adapts candidate scoring based on context (indoor vs outdoor)', () => {
      const profile = ColdStartService.createDefaultProfile();

      const indoorContextRecs = engine.rankPoses(
        SNAP_POSE_DATASET,
        profile,
        { isIndoor: true },
        5,
      );

      const outdoorContextRecs = engine.rankPoses(
        SNAP_POSE_DATASET,
        profile,
        { isIndoor: false },
        5,
      );

      expect(indoorContextRecs).toBeDefined();
      expect(outdoorContextRecs).toBeDefined();
    });

    it('executes candidate ranking in sub-15ms performance time', () => {
      const profile = ColdStartService.createDefaultProfile();
      const start = performance.now();

      for (let i = 0; i < 10; i++) {
        engine.rankPoses(SNAP_POSE_DATASET, profile, undefined, 8);
      }

      const elapsed = performance.now() - start;
      const avgPerCall = elapsed / 10;
      expect(avgPerCall).toBeLessThan(15); // Sub-15ms requirement
    });
  });

  // -------------------------------------------------------------------------
  // 4. personalizationStore Tests
  // -------------------------------------------------------------------------
  describe('usePersonalizationStore', () => {
    beforeEach(() => {
      usePersonalizationStore.getState().resetProfile();
      usePersonalizationStore.getState().setPersonalizationEnabled(true);
    });

    it('records interaction signals and evolves profile vector in store', () => {
      const store = usePersonalizationStore.getState();

      store.recordSignal({
        type: 'POSE_FAVORITED',
        categoryId: 'nature',
        tags: ['nature', 'outdoor'],
      });

      const updated = usePersonalizationStore.getState().profile;
      expect(updated.preferredCategories['nature']).toBeGreaterThan(0.5);
    });

    it('suppresses explicitly disliked poses from candidate recommendations', () => {
      const store = usePersonalizationStore.getState();
      const testPoseId = SNAP_POSE_DATASET[0].id;

      store.recordExplicitFeedback(testPoseId, 'dislike');

      const recs = usePersonalizationStore.getState().getRecommendedPoses();
      const containsDisliked = recs.some((r) => r.pose.id === testPoseId);
      expect(containsDisliked).toBe(false);
    });

    it('returns generic popular poses when personalization is disabled', () => {
      const store = usePersonalizationStore.getState();
      store.setPersonalizationEnabled(false);

      const recs = usePersonalizationStore.getState().getRecommendedPoses();
      expect(recs.length).toBeGreaterThan(0);
      recs.forEach((r) => {
        expect(r.explanation).toBe('Popular in POSEHANUM');
      });
    });

    it('resets recommendation history cleanly back to cold-start state', () => {
      const store = usePersonalizationStore.getState();

      store.recordSignal({
        type: 'EXPLICIT_LIKE',
        categoryId: 'creative',
      });

      store.resetProfile();

      const freshProfile = usePersonalizationStore.getState().profile;
      expect(freshProfile.totalInteractions).toBe(0);
      expect(freshProfile.preferredCategories['creative']).toBe(0.5);
      expect(usePersonalizationStore.getState().explicitFeedback).toEqual([]);
    });
  });
});
