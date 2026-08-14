import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './en.json';

/**
 * i18n instance configured with expo-localization for device locale detection.
 * Falls back to English when a locale is missing a translation.
 *
 * Usage:
 *   import { i18n } from '@/i18n';
 *   i18n.t('common.retry'); // → "Retry"
 */
const i18n = new I18n({ en });

// Use the device's first preferred locale; fall back to 'en'.
i18n.locale = Localization.getLocales()?.[0]?.languageTag ?? 'en';

// Return the key itself when a translation is missing (never crashes).
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export { i18n };

/**
 * Convenience wrapper — same as `i18n.t` but typed to accept dot-notation keys.
 * Import `t` directly for terse usage in components.
 */
export const t = (key: string, options?: Record<string, unknown>): string =>
  i18n.t(key, options);
