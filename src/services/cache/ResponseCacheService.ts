/**
 * ResponseCacheService — In-memory TTL cache service.
 *
 * Caches dataset query results, rendered fragments, and API JSON responses
 * to serve repeated requests instantly without re-calculation or network roundtrips.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class ResponseCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTtlMs: number;

  constructor(defaultTtlMs = 60000) {
    this.defaultTtlMs = defaultTtlMs;
  }

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  public set<T>(key: string, value: T, ttlMs?: number): void {
    const expiresAt = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.cache.set(key, { value, expiresAt });
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public invalidate(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }
}

export const responseCacheService = new ResponseCacheService(60000); // 1-minute default TTL
