import type { ServiceWithDistance } from '@/types';
import { isServiceOpenNow, type OpeningStatus } from '@/utils/openingTimes';

/**
 * Cache for opening times calculations to avoid expensive recalculations
 * 
 * This cache uses a combination of service ID and current time (rounded to minutes)
 * to cache opening status calculations, significantly reducing CPU usage.
 */

interface CacheEntry {
  status: OpeningStatus;
  calculatedAt: number;
}

class OpeningTimesCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 500; // Maximum number of cache entries
  private cacheDurationMs = 60000; // Cache for 1 minute (opening status doesn't change that frequently)
  
  /**
   * Get cached opening status or calculate and cache it
   */
  getOpeningStatus(service: ServiceWithDistance): OpeningStatus {
    const cacheKey = this.generateCacheKey(service);
    const now = Date.now();
    
    const cached = this.cache.get(cacheKey);
    if (cached && (now - cached.calculatedAt) < this.cacheDurationMs) {
      return cached.status;
    }
    
    // Calculate opening status
    const status = isServiceOpenNow(service);
    
    // Cache the result
    this.setCachedStatus(cacheKey, status, now);
    
    return status;
  }
  
  /**
   * Generate cache key from service ID and current time (rounded to minutes)
   */
  private generateCacheKey(service: ServiceWithDistance): string {
    const serviceId = (service as ServiceWithDistance & { id?: string; _id?: string }).id || 
                      (service as ServiceWithDistance & { id?: string; _id?: string })._id || 
                      'unknown';
    const currentTimeMinutes = Math.floor(Date.now() / (1000 * 60)); // Round to minutes
    return `${serviceId}-${currentTimeMinutes}`;
  }
  
  /**
   * Store calculated status in cache
   */
  private setCachedStatus(key: string, status: OpeningStatus, timestamp: number): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, {
      status,
      calculatedAt: timestamp
    });
  }
  
  /**
   * Clear expired cache entries
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.calculatedAt > this.cacheDurationMs) {
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
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      cacheDurationMs: this.cacheDurationMs
    };
  }
}

// Create singleton instance
const openingTimesCache = new OpeningTimesCache();

// Cleanup expired entries every 5 minutes
setInterval(() => {
  openingTimesCache.cleanup();
}, 5 * 60 * 1000);

export default openingTimesCache;