import { MMKV } from 'react-native-mmkv';

/**
 * Global MMKV singleton — synchronous key-value store.
 * All persistent app state (theme, settings, offline queue, etc.) reads/writes here.
 * Authentication tokens are NEVER stored here — use Expo SecureStore instead. [Req 26.1]
 * [Req 25.3]
 */
export const mmkv = new MMKV({ id: 'snap-pose-store' });

/**
 * Write any value to MMKV.
 * Strings and booleans are stored as-is.
 * Objects and arrays are JSON.stringify-ed to a string.
 * Numbers are stored natively as numbers.
 */
export function mmkvSet(key: string, value: unknown): void {
  if (typeof value === 'boolean') {
    mmkv.set(key, value);
  } else if (typeof value === 'number') {
    mmkv.set(key, value);
  } else if (typeof value === 'string') {
    mmkv.set(key, value);
  } else {
    mmkv.set(key, JSON.stringify(value));
  }
}

/**
 * Read a value from MMKV and attempt to parse it as type T.
 * Returns null if the key does not exist or parsing fails.
 *
 * Behaviour by stored type:
 *  - boolean  → returned directly (no JSON parse)
 *  - number   → returned directly
 *  - string   → attempt JSON.parse; if it fails, return the raw string cast as T
 */
export function mmkvGet<T>(key: string): T | null {
  // Try boolean first
  const boolVal = mmkv.getBoolean(key);
  if (boolVal !== undefined) {
    return boolVal as unknown as T;
  }

  // Try number
  const numVal = mmkv.getNumber(key);
  if (numVal !== undefined) {
    return numVal as unknown as T;
  }

  // Try string (covers JSON-encoded objects/arrays and plain strings)
  const strVal = mmkv.getString(key);
  if (strVal === undefined) {
    return null;
  }

  try {
    return JSON.parse(strVal) as T;
  } catch {
    return strVal as unknown as T;
  }
}

/**
 * Delete a single key from MMKV.
 */
export function mmkvDelete(key: string): void {
  mmkv.delete(key);
}

/**
 * Clear ALL keys from the MMKV store.
 * Use with caution — this removes every persisted value.
 */
export function mmkvClear(): void {
  mmkv.clearAll();
}
