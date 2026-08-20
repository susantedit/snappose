/**
 * GrowthExperimentEngine — Privacy-Safe Product-Led Growth & A/B Experimentation Framework.
 *
 * Facilitates conversion tracking, onboarding experiment assignment,
 * and DAU retention funnel milestone evaluation.
 */

import { mmkv } from '@/database/mmkv/mmkvClient';

export type GrowthExperimentVariant = 'control' | 'variant_a' | 'variant_b';

export interface FunnelMilestone {
  discovery: boolean;
  firstGuidedShot: boolean;
  secondSession: boolean;
  personalizationActive: boolean;
  challengeCompleted: boolean;
  sharedCard: boolean;
  referralSent: boolean;
}

const STORAGE_KEY_EXPERIMENTS = 'posehanum_growth_experiments';
const STORAGE_KEY_FUNNEL = 'posehanum_growth_funnel';

export class GrowthExperimentEngine {
  /**
   * Get assigned variant for an experiment (persistently stored per device).
   */
  public getExperimentVariant(experimentKey: string): GrowthExperimentVariant {
    try {
      const raw = mmkv.getString(`${STORAGE_KEY_EXPERIMENTS}_${experimentKey}`);
      if (raw) return raw as GrowthExperimentVariant;

      // Assign random variant
      const variants: GrowthExperimentVariant[] = ['control', 'variant_a', 'variant_b'];
      const assigned = variants[Math.floor(Math.random() * variants.length)];
      mmkv.set(`${STORAGE_KEY_EXPERIMENTS}_${experimentKey}`, assigned);
      return assigned;
    } catch {
      return 'control';
    }
  }

  /**
   * Track milestone completion in the 40K DAU retention funnel.
   */
  public trackMilestone(milestone: keyof FunnelMilestone): void {
    try {
      const current = this.getFunnelState();
      current[milestone] = true;
      mmkv.set(STORAGE_KEY_FUNNEL, JSON.stringify(current));
    } catch {}
  }

  public getFunnelState(): FunnelMilestone {
    try {
      const raw = mmkv.getString(STORAGE_KEY_FUNNEL);
      if (raw) return JSON.parse(raw);
    } catch {}

    return {
      discovery: true,
      firstGuidedShot: false,
      secondSession: false,
      personalizationActive: false,
      challengeCompleted: false,
      sharedCard: false,
      referralSent: false,
    };
  }
}
