/**
 * MongoDB implementation of the stats repository
 * Fetches live statistics from the database
 */

import { getClientPromise } from '@/utils/mongodb';
import type { StatsRepository, Stats } from './stats.repository';

export const createMongoStatsRepository = (): StatsRepository => ({
  async getStats(): Promise<Stats> {
    const client = await getClientPromise();
    const db = client.db('streetsupport');

    // Count published organisations
    const organisationsCount = await db
      .collection('ServiceProviders')
      .countDocuments({ IsPublished: true });

    // Get all published organisations to count their services
    const publishedOrgs = await db
      .collection('ServiceProviders')
      .find({ IsPublished: true })
      .project({ Key: 1 })
      .toArray();

    const orgKeys = publishedOrgs.map((org) => org.Key);

    // Count unique services grouped by organisation + category + subcategory
    const uniqueServices = await db
      .collection('ProvidedServices')
      .aggregate([
        {
          $match: {
            ServiceProviderKey: { $in: orgKeys },
            IsPublished: true,
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
        {
          $count: 'total',
        },
      ])
      .toArray();

    const servicesCount = uniqueServices[0]?.total || 0;

    // Count public cities/locations (partnerships)
    const locationsCount = await db
      .collection('Cities')
      .countDocuments({ IsPublic: true });

    return {
      organisations: organisationsCount,
      services: servicesCount,
      partnerships: locationsCount,
    };
  },
});
