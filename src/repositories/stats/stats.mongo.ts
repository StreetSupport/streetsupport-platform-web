/**
 * MongoDB implementation of the stats repository
 * Fetches live statistics from the database
 */

import { getClientPromise } from '@/utils/mongodb';
import type { StatsRepository, Stats } from './stats.repository';
import { DB_NAME } from '@/config/constants';

export const createMongoStatsRepository = (): StatsRepository => ({
  async getStats(): Promise<Stats> {
    const client = await getClientPromise();
    const db = client.db(DB_NAME);

    const [organisationsCount, uniqueServices, locationsCount] = await Promise.all([
      db.collection('ServiceProviders').countDocuments({ IsPublished: true }),

      db.collection('ProvidedServices').aggregate([
        {
          $lookup: {
            from: 'ServiceProviders',
            localField: 'ServiceProviderKey',
            foreignField: 'Key',
            as: 'provider',
            pipeline: [
              { $match: { IsPublished: true } },
              { $project: { _id: 1 } },
            ],
          },
        },
        {
          $match: {
            IsPublished: true,
            'provider.0': { $exists: true },
          },
        },
        {
          $group: {
            _id: {
              provider: '$ServiceProviderKey',
              category: '$ParentCategoryKey',
              subcategory: '$SubCategoryKey',
            },
          },
        },
        { $count: 'total' },
      ]).toArray(),

      db.collection('Cities').countDocuments({ IsPublic: true }),
    ]);

    return {
      organisations: organisationsCount,
      services: uniqueServices[0]?.total || 0,
      partnerships: locationsCount,
    };
  },
});
