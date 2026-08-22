/**
 * Simple in-memory TTL cache for backend route responses.
 *
 * A lightweight alternative to Redis for caching expensive MongoDB aggregations.
 * Entries expire after `ttlMs` milliseconds. The cache is bounded to 500 entries max
 * (LRU eviction: oldest entry removed when full).
 *
 * Usage:
 *   import { routeCache } from './cache';
 *
 *   // In a route handler:
 *   const cacheKey = 'poses:all';
 *   const cached = routeCache.get<Pose[]>(cacheKey);
 *   if (cached) return res.json(success(cached));
 *
 *   const data = await Pose.find(query).lean();
 *   routeCache.set(cacheKey, data, 5 * 60 * 1000); // 5-minute TTL
 *   return res.json(success(data));
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  key: string;
}

class RouteTTLCache {
  private readonly _store = new Map<string, CacheEntry<unknown>>();
  private readonly _maxEntries: number;

  constructor(maxEntries = 500) {
    this._maxEntries = maxEntries;
  }

  /**
   * Retrieve a cached value. Returns undefined if the key is missing or expired.
   */
  get<T>(key: string): T | undefined {
    const entry = this._store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return undefined;
    }

    return entry.value;
  }

  /**
   * Store a value with a TTL.
   * @param key    Cache key
   * @param value  Value to store
   * @param ttlMs  Time-to-live in milliseconds (default: 60,000 = 1 minute)
   */
  set<T>(key: string, value: T, ttlMs = 60_000): void {
    // LRU eviction: remove the oldest entry if we've hit the cap
    if (this._store.size >= this._maxEntries) {
      const oldestKey = this._store.keys().next().value;
      if (oldestKey) {
        this._store.delete(oldestKey);
      }
    }

    this._store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
      key,
    });
  }

  /**
   * Invalidate all entries whose key starts with the given prefix.
   * Useful for invalidating a route family after a write.
   * @example routeCache.invalidatePrefix('templates:');
   */
  invalidatePrefix(prefix: string): number {
    let count = 0;
    for (const key of this._store.keys()) {
      if (key.startsWith(prefix)) {
        this._store.delete(key);
        count++;
      }
    }
    return count;
  }

  /**
   * Invalidate a single cache key.
   */
  delete(key: string): void {
    this._store.delete(key);
  }

  /**
   * Clear all cache entries.
   */
  clear(): void {
    this._store.clear();
  }

  /**
   * Returns the number of (non-expired) entries in the cache.
   */
  get size(): number {
    const now = Date.now();
    let count = 0;
    for (const entry of this._store.values()) {
      if (entry.expiresAt > now) count++;
    }
    return count;
  }
}

// Singleton cache instance shared across all route handlers
export const routeCache = new RouteTTLCache(500);

// TTL constants for each resource type
export const CACHE_TTL = {
  poses: 5 * 60 * 1000,       // 5 minutes — static pose data
  categories: 10 * 60 * 1000, // 10 minutes — rarely changes
  templates: 2 * 60 * 1000,   // 2 minutes — community templates update frequently
  config: 15 * 60 * 1000,     // 15 minutes — app config
} as const;

/**
 * Generates a deterministic cache key from a route path and query parameters.
 * Ensures consistent ordering of query params.
 */
export function makeCacheKey(route: string, params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) return route;
  const sortedParams = Object.fromEntries(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .sort(([a], [b]) => a.localeCompare(b)),
  );
  return `${route}:${JSON.stringify(sortedParams)}`;
}

/**
 * Generates an ETag for a JSON-serializable value.
 * A simple deterministic hash of the serialized content length + first 64 chars.
 */
export function generateETag(data: unknown): string {
  const str = JSON.stringify(data);
  const hash = str.length.toString(36) + '-' + str.slice(0, 64).split('').reduce(
    (acc, c) => ((acc << 5) - acc + c.charCodeAt(0)) | 0,
    0,
  ).toString(36).replace('-', 'n');
  return `"${hash}"`;
}
