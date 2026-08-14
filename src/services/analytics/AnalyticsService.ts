/**
 * AnalyticsService — typed wrapper around @react-native-firebase/analytics.
 *
 * Design constraints (Req 27):
 * - Never throws; all errors are swallowed so analytics can never crash the app.
 * - Never logs sensitive data: passwords, tokens, camera frames, or biometric data.
 * - All calls are fire-and-forget (void returns, never awaited in hot paths).
 */

import analytics from '@react-native-firebase/analytics';

// ─── Event name union ────────────────────────────────────────────────────────

/** The exhaustive set of analytics event names emitted by Snap Pose. */
export type AnalyticsEventName =
  | 'app_open'
  | 'screen_view'
  | 'pose_open'
  | 'camera_open'
  | 'photo_capture'
  | 'favorite_add'
  | 'search_started'
  | 'native_ad_loaded'
  | 'rewarded_completed'
  | 'auto_capture'
  | 'voice_guidance_played'
  | 'capture_limit_hit'
  | 'reward_ad_watched';

// ─── Sensitive key deny-list ──────────────────────────────────────────────────

/**
 * Keys that must never appear in analytics event parameters.
 * Any param whose key contains one of these substrings (case-insensitive) is stripped.
 */
const SENSITIVE_KEY_FRAGMENTS: string[] = ['password', 'token', 'frame', 'biometric'];

/**
 * Strip any params whose key names contain a sensitive fragment.
 * Returns a new object with only safe keys.
 */
function sanitiseParams(
  params: Record<string, string | number | boolean> | undefined,
): Record<string, string | number | boolean> | undefined {
  if (!params) return undefined;

  const safe: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = SENSITIVE_KEY_FRAGMENTS.some((fragment) =>
      lowerKey.includes(fragment),
    );
    if (!isSensitive) {
      safe[key] = value;
    }
  }

  return Object.keys(safe).length > 0 ? safe : undefined;
}

// ─── User properties shape ────────────────────────────────────────────────────

export interface UserProperties {
  userType?: 'anonymous' | 'google';
  country?: string;
  language?: string;
  appVersion?: string;
  deviceModel?: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

/**
 * Typed analytics service.
 *
 * All public methods are synchronous (fire-and-forget).
 * The underlying Firebase SDK calls return Promises which are intentionally
 * not awaited so they never block the UI thread.
 */
const AnalyticsService = {
  /**
   * Log a named analytics event with optional parameters.
   * Sensitive param keys are stripped before the event is sent.
   *
   * @param name   - One of the 14 defined event names.
   * @param params - Optional key/value pairs (strings, numbers, or booleans).
   */
  logEvent(
    name: AnalyticsEventName,
    params?: Record<string, string | number | boolean>,
  ): void {
    try {
      const sanitised = sanitiseParams(params);
      // Fire-and-forget — intentionally not awaited.
      analytics()
        .logEvent(name, sanitised as Record<string, unknown>)
        .catch(() => {
          // Silently swallow async errors; analytics must never crash the app.
        });
    } catch {
      // Silently swallow synchronous errors.
    }
  },

  /**
   * Log a screen_view event.
   *
   * @param screenName  - The name of the screen (e.g. 'HomeScreen').
   * @param screenClass - Optional class name (defaults to screenName).
   */
  logScreenView(screenName: string, screenClass?: string): void {
    try {
      analytics()
        .logScreenView({
          screen_name: screenName,
          screen_class: screenClass ?? screenName,
        })
        .catch(() => {});
    } catch {
      // Silently swallow.
    }
  },

  /**
   * Set a single user property.
   * Pass `null` to clear a previously set property.
   *
   * @param name  - Property name.
   * @param value - Property value or null to clear.
   */
  setUserProperty(name: string, value: string | null): void {
    try {
      analytics()
        .setUserProperty(name, value)
        .catch(() => {});
    } catch {
      // Silently swallow.
    }
  },

  /**
   * Set all standard Snap Pose user properties in one call.
   * Only the provided (non-undefined) properties are written.
   *
   * @param props - A partial set of UserProperties.
   */
  setUserProperties(props: UserProperties): void {
    try {
      // Build a flat string-value record from the typed props.
      const flat: Record<string, string> = {};

      if (props.userType !== undefined) flat['userType'] = props.userType;
      if (props.country !== undefined) flat['country'] = props.country;
      if (props.language !== undefined) flat['language'] = props.language;
      if (props.appVersion !== undefined) flat['appVersion'] = props.appVersion;
      if (props.deviceModel !== undefined) flat['deviceModel'] = props.deviceModel;

      if (Object.keys(flat).length === 0) return;

      analytics()
        .setUserProperties(flat)
        .catch(() => {});
    } catch {
      // Silently swallow.
    }
  },
} as const;

export default AnalyticsService;
