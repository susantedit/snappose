import { MMKV } from 'react-native-mmkv';

/**
 * In-memory fallback MMKV implementation when running in Expo Go, Web,
 * or environments without native C++ MMKV binaries linked.
 */
class MemoryMMKV {
  private store = new Map<string, any>();
  private listeners = new Set<(key: string) => void>();

  set(key: string, value: boolean | string | number | Uint8Array): void {
    this.store.set(key, value);
    this.listeners.forEach((listener) => {
      try {
        listener(key);
      } catch {}
    });
  }

  getBoolean(key: string): boolean | undefined {
    const val = this.store.get(key);
    return typeof val === 'boolean' ? val : undefined;
  }

  getString(key: string): string | undefined {
    const val = this.store.get(key);
    return typeof val === 'string' ? val : undefined;
  }

  getNumber(key: string): number | undefined {
    const val = this.store.get(key);
    return typeof val === 'number' ? val : undefined;
  }

  getBuffer(key: string): Uint8Array | undefined {
    const val = this.store.get(key);
    return val instanceof Uint8Array ? val : undefined;
  }

  contains(key: string): boolean {
    return this.store.has(key);
  }

  delete(key: string): boolean {
    const res = this.store.delete(key);
    if (res) {
      this.listeners.forEach((listener) => {
        try {
          listener(key);
        } catch {}
      });
    }
    return res;
  }

  getAllKeys(): string[] {
    return Array.from(this.store.keys());
  }

  clearAll(): void {
    this.store.clear();
  }

  recrypt(_key: string | undefined): void {}

  trim(): void {}

  addOnValueChangedListener(onValueChanged: (key: string) => void): { remove: () => void } {
    this.listeners.add(onValueChanged);
    return {
      remove: () => {
        this.listeners.delete(onValueChanged);
      },
    };
  }
}

function createMMKVClient(): MMKV | MemoryMMKV {
  try {
    return new MMKV({ id: 'snap-pose-store' });
  } catch (error) {
    console.warn(
      '[SnapPose] Native MMKV module not available (e.g. Expo Go / Web). Using safe in-memory fallback store.'
    );
    return new MemoryMMKV() as unknown as MMKV;
  }
}

/**
 * Global MMKV singleton — synchronous key-value store.
 * All persistent app state reads/writes here with safe fallback.
 */
export const mmkv = createMMKVClient();

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
 */
export function mmkvClear(): void {
  mmkv.clearAll();
}
