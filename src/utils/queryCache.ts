/**
 * Simple in-memory cache for API query results
 * 
 * This provides a lightweight caching layer to reduce database queries
 * for frequently accessed data like services and organisation information.
 */

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class QueryCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 200; // Increased cache size for better performance
  private hitCount = 0;
  private missCount = 0;
  
  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.missCount++;
      return null;
    }
    
    // Check if cache entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }
    
    this.hitCount++;
    // Move to end for LRU behaviour
    this.cache.delete(key);
    this.cache.set(key, entry);
    
    return entry.data as T;
  }
  
  /**
   * Set cached data with TTL
   */
  set<T>(key: string, data: T, ttlMs: number = 300000): void { // Default 5 minutes
    // Remove oldest entries if cache is full (LRU eviction)
    while (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }
  
  /**
   * Clear expired entries
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
  
  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache statistics
   */
  getStats() {
    const totalRequests = this.hitCount + this.missCount;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hitCount: this.hitCount,
      missCount: this.missCount,
      hitRate: totalRequests > 0 ? (this.hitCount / totalRequests * 100).toFixed(2) + '%' : '0%',
      entries: Array.from(this.cache.keys())
    };
  }
  
  /**
   * Generate cache key from query parameters
   */
  generateKey(params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {} as Record<string, unknown>);
    
    return JSON.stringify(sortedParams);
  }
}

// Create singleton instance
const queryCache = new QueryCache();

// Cleanup expired entries every 10 minutes
setInterval(() => {
  queryCache.cleanup();
}, 10 * 60 * 1000);

export default queryCache;