// Request deduplication utility to prevent duplicate API calls
type RequestPromise<T = unknown> = Promise<T>;

class RequestDeduplicator {
  private requestCache = new Map<string, RequestPromise>();
  private isEnabled: boolean;

  constructor() {
    // Automatically disable in test environments
    this.isEnabled = !this.isTestEnvironment();
  }

  /**
   * Detect if we're in a test environment
   */
  private isTestEnvironment(): boolean {
    return (
      typeof process !== 'undefined' && 
      (process.env.NODE_ENV === 'test' || 
       process.env.PLAYWRIGHT_TEST === '1' ||
       typeof window !== 'undefined' && window.location?.href?.includes('localhost'))
    );
  }

  /**
   * Enable or disable request deduplication (useful for testing)
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.clear(); // Clear cache when disabling
    }
  }

  /**
   * Check if deduplication is currently enabled
   */
  get enabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Deduplicate requests by caching ongoing promises
   * Returns the same promise for identical requests made within the cache window
   * Skips deduplication if disabled (e.g., in tests)
   */
  dedupe<T>(key: string, requestFn: () => Promise<T>, ttlMs: number = 5000): Promise<T> {
    // Skip deduplication if disabled (for testing scenarios)
    if (!this.isEnabled) {
      return requestFn();
    }

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
export function createRequestKey(url: string, params?: Record<string, unknown>): string {
  if (!params) return url;
  
  // Sort params for consistent keys
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
    
  return `${url}?${sortedParams}`;
}