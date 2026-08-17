/**
 * LocationCategorySuggester — Privacy-First Context & Location-Aware Category Suggester.
 *
 * Suggests best-matching pose categories based on environment context:
 *  - Mountain / Trek -> 'trek', 'mountain', 'nature'
 *  - Beach / Coastal -> 'beach', 'summer', 'outdoor'
 *  - Cafe / Indoor -> 'cafe', 'indoor', 'sitting'
 *  - Urban / City -> 'street', 'city', 'standing'
 *  - Travel / Landmark -> 'travel', 'outdoor'
 *
 * 100% on-device, zero tracking. Supports manual context chips with optional GPS fallback.
 */

export interface LocationContext {
  environment: 'mountain' | 'beach' | 'cafe' | 'city' | 'travel' | 'auto';
  label: string;
  suggestedCategories: string[];
  suggestedTags: string[];
}

export const CONTEXT_PRESETS: Record<string, LocationContext> = {
  mountain: {
    environment: 'mountain',
    label: 'Mountains & Trek',
    suggestedCategories: ['trek', 'mountain', 'nature'],
    suggestedTags: ['outdoor', 'standing', 'adventure', 'landscape'],
  },
  beach: {
    environment: 'beach',
    label: 'Beach & Coastal',
    suggestedCategories: ['beach', 'summer', 'outdoor'],
    suggestedTags: ['candid', 'relaxed', 'sunset', 'silhouette'],
  },
  cafe: {
    environment: 'cafe',
    label: 'Café & Cozy',
    suggestedCategories: ['cafe', 'indoor', 'sitting'],
    suggestedTags: ['table', 'coffee', 'candid', 'lifestyle'],
  },
  city: {
    environment: 'city',
    label: 'City & Street',
    suggestedCategories: ['street', 'city', 'standing'],
    suggestedTags: ['urban', 'architecture', 'editorial', 'walk'],
  },
  travel: {
    environment: 'travel',
    label: 'Travel & Landmarks',
    suggestedCategories: ['travel', 'outdoor', 'portrait'],
    suggestedTags: ['landmark', 'monument', 'vacation'],
  },
};

export class LocationCategorySuggester {
  /**
   * Suggests categories based on chosen context environment.
   */
  public static getSuggestionsForContext(contextKey: string): LocationContext {
    return CONTEXT_PRESETS[contextKey] || CONTEXT_PRESETS.city;
  }

  /**
   * Evaluates time-of-day and context to auto-suggest an environment when none selected.
   */
  public static getAutoSuggestedContext(date: Date = new Date()): LocationContext {
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    // Weekend morning -> Trek / Nature
    if ((day === 0 || day === 6) && hour >= 7 && hour < 12) {
      return CONTEXT_PRESETS.mountain;
    }
    // Midday -> Cafe
    if (hour >= 11 && hour < 16) {
      return CONTEXT_PRESETS.cafe;
    }
    // Late afternoon / Golden hour -> Beach / Outdoor
    if (hour >= 16 && hour < 19) {
      return CONTEXT_PRESETS.beach;
    }
    // Evening / Night -> City
    return CONTEXT_PRESETS.city;
  }
}
