// Request deduplication utility to prevent duplicate API calls
type RequestPromise<T = any> = Promise<T>;

class RequestDeduplicator {
  private requestCache = new Map<string, RequestPromise>();

  /**
   * Deduplicate requests by caching ongoing promises
   * Returns the same promise for identical requests made within the cache window
   */
  dedupe<T>(key: string, requestFn: () => Promise<T>, ttlMs: number = 5000): Promise<T> {
    const existing = this.requestCache.get(key);
    
    if (existing) {
      return existing as Promise<T>;
    }

    const requestPromise = requestFn()
      .finally(() => {
        // Clean up cache entry after TTL
        setTimeout(() => {
          this.requestCache.delete(key);
        }, ttlMs);
      });

    this.requestCache.set(key, requestPromise);
    return requestPromise;
  }

  /**
   * Clear all cached requests (useful for testing or forced refresh)
   */
  clear(): void {
    this.requestCache.clear();
  }

  /**
   * Get current cache size (useful for debugging)
   */
  get size(): number {
    return this.requestCache.size;
  }
}

// Global instance for request deduplication
export const requestDeduplicator = new RequestDeduplicator();

/**
 * Helper function to create a deduplication key from URL and parameters
 */
export function createRequestKey(url: string, params?: Record<string, any>): string {
  if (!params) return url;
  
  // Sort params for consistent keys
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
    
  return `${url}?${sortedParams}`;
}