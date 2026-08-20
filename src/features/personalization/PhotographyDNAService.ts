/**
 * PhotographyDNAService — Visual Photography Style Profile & Signature Poses.
 *
 * Analyzes historical capture match scores and preference vectors to calculate
 * the user's Photography DNA (e.g. Standing: 95%, Outdoor: 92%, 3/4 Angle: 91%).
 */

import type { UserPreferenceProfile } from './types';
import type { Pose } from '@/features/poses/types';

export interface PhotographyDNAAttribute {
  label: string;
  scorePercent: number;
  categoryKey: string;
}

export interface UserPhotographyDNA {
  topAttributes: PhotographyDNAAttribute[];
  signatureStyleName: string;
  totalSessions: number;
  overallMasteryScore: number;
}

export class PhotographyDNAService {
  public calculateDNA(profile: UserPreferenceProfile): UserPhotographyDNA {
    const categories = profile.preferredCategories || {};

    const topCategories = Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const topAttributes: PhotographyDNAAttribute[] = topCategories.map(([key, val]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      scorePercent: Math.round(85 + val * 12),
      categoryKey: key,
    }));

    if (topAttributes.length === 0) {
      topAttributes.push(
        { label: 'Outdoor', scorePercent: 92, categoryKey: 'nature' },
        { label: 'Standing', scorePercent: 95, categoryKey: 'standing' },
        { label: '3/4 Angle', scorePercent: 91, categoryKey: 'portrait' },
        { label: 'Natural Expression', scorePercent: 94, categoryKey: 'casual' },
      );
    }

    const primaryStyle = topAttributes[0]?.label || 'Aesthetic Lifestyle';
    const overallMasteryScore = Math.min(
      98,
      Math.max(75, Math.round(profile.averageMatchScore || 88)),
    );

    return {
      topAttributes,
      signatureStyleName: `${primaryStyle} Visionary`,
      totalSessions: profile.totalSuccessfulCaptures || 12,
      overallMasteryScore,
    };
  }

  public getSignaturePoses(poses: Pose[], profile: UserPreferenceProfile): Pose[] {
    if (!poses || poses.length === 0) return [];
    const topCatKeys = new Set(
      Object.entries(profile.preferredCategories || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([k]) => k.toLowerCase()),
    );

    const matches = poses.filter((p) => {
      const cat = (p.categoryId || p.category || '').toLowerCase();
      return topCatKeys.has(cat) || p.tags.some((t) => topCatKeys.has(t.toLowerCase()));
    });

    return matches.length > 0 ? matches.slice(0, 4) : poses.slice(0, 4);
  }
}
