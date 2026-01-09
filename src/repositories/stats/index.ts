/**
 * Stats repository factory
 * Selects the appropriate implementation based on environment
 */

import type { StatsRepository } from './stats.repository';
import { createMongoStatsRepository } from './stats.mongo';
import { createStaticStatsRepository } from './stats.static';

export type { StatsRepository, Stats } from './stats.repository';

/**
 * Creates a stats repository instance
 * Uses MongoDB when MONGODB_URI is available, otherwise falls back to static data
 */
export const createStatsRepository = (): StatsRepository => {
  if (!process.env.MONGODB_URI) {
    return createStaticStatsRepository();
  }
  return createMongoStatsRepository();
};

// Export a singleton instance for convenience
export const statsRepository = createStatsRepository();
