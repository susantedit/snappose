/**
 * ColdStartService — Initial Preference Vector Generation for New Users.
 *
 * Provides balanced neutral defaults and computes initial vectors from optional onboarding survey choices.
 */

import type {
  ExperienceLevel,
  OutfitCategory,
  PoseStyle,
  UserPreferenceProfile,
} from '../types';
import { MODEL_VERSION } from './PersonalizationEngine';

export interface ColdStartAnswers {
  photoTypes?: string[];
  style?: PoseStyle;
  experienceLevel?: ExperienceLevel;
  outfitCategory?: OutfitCategory;
}

export class ColdStartService {
  /**
   * Generates a neutral baseline profile for a new user with no prior history.
   */
  public static createDefaultProfile(): UserPreferenceProfile {
    return {
      preferredCategories: {
        street: 0.5,
        cafe: 0.5,
        nature: 0.5,
        portrait: 0.5,
        selfie: 0.5,
        beach: 0.5,
        travel: 0.5,
        studio: 0.5,
        couple: 0.5,
        lifestyle: 0.5,
        creative: 0.5,
        standing: 0.5,
      },
      preferredPoseTypes: {
        standing: 0.5,
        sitting: 0.5,
        leaning: 0.5,
        walking: 0.5,
        candid: 0.5,
        portrait: 0.5,
        selfie: 0.5,
        couple: 0.5,
      },
      preferredCameraAngles: {
        'eye-level': 0.6,
        'low-angle': 0.5,
        'high-angle': 0.5,
        side: 0.5,
      },
      difficultyPreference: 0.4,
      averageMatchScore: 72,
      favoritePoseStyle: 'natural',
      preferredOutfit: 'casual',
      experienceLevel: 'beginner',
      voiceCoachUsage: 0.5,
      autoCaptureUsage: 0.5,
      totalInteractions: 0,
      totalSuccessfulCaptures: 0,
      lastUpdated: new Date().toISOString(),
      modelVersion: MODEL_VERSION,
    };
  }

  /**
   * Generates an initial profile vector informed by onboarding questions.
   */
  public static createProfileFromAnswers(answers: ColdStartAnswers): UserPreferenceProfile {
    const base = this.createDefaultProfile();

    // 1. Boost Selected Categories
    if (answers.photoTypes && answers.photoTypes.length > 0) {
      for (const type of answers.photoTypes) {
        const key = type.toLowerCase();
        base.preferredCategories[key] = 0.85;
        base.preferredPoseTypes[key] = 0.8;
      }
    }

    // 2. Set Preferred Aesthetic Style
    if (answers.style) {
      base.favoritePoseStyle = answers.style;
    }

    // 3. Set Skill / Difficulty
    if (answers.experienceLevel) {
      base.experienceLevel = answers.experienceLevel;
      if (answers.experienceLevel === 'beginner') {
        base.difficultyPreference = 0.3;
        base.averageMatchScore = 65;
      } else if (answers.experienceLevel === 'intermediate') {
        base.difficultyPreference = 0.55;
        base.averageMatchScore = 78;
      } else if (answers.experienceLevel === 'advanced') {
        base.difficultyPreference = 0.8;
        base.averageMatchScore = 88;
      }
    }

    // 4. Set Outfit
    if (answers.outfitCategory) {
      base.preferredOutfit = answers.outfitCategory;
    }

    return base;
  }
}
