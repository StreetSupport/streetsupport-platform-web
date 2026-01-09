/**
 * Static implementation of the stats repository
 * Uses pre-fetched JSON data when MongoDB is not available
 */

import type { StatsRepository, Stats } from './stats.repository';

interface ServiceProvider {
  id: string;
  name: string;
  published: boolean;
  services?: {
    category: string;
    subCategory: string;
  }[];
}

interface Location {
  id: string;
  isPublic: boolean;
}

export const createStaticStatsRepository = (): StatsRepository => ({
  async getStats(): Promise<Stats> {
    const serviceProvidersData = await import('@/data/service-providers.json');
    const locationsData = await import('@/data/locations.json');

    const serviceProviders: ServiceProvider[] = serviceProvidersData.default;
    const locations: Location[] = locationsData.default;

    // Count published organisations
    const publishedProviders = serviceProviders.filter(
      (provider) => provider.published
    );
    const organisationsCount = publishedProviders.length;

    // Count unique services grouped by organisation + category + subcategory
    const uniqueServiceKeys = new Set<string>();
    publishedProviders.forEach((provider) => {
      if (provider.services && Array.isArray(provider.services)) {
        provider.services.forEach((service) => {
          const uniqueKey = `${provider.id}-${service.category}-${service.subCategory}`;
          uniqueServiceKeys.add(uniqueKey);
        });
      }
    });
    const servicesCount = uniqueServiceKeys.size;

    // Count public locations (partnerships)
    const publicLocations = locations.filter(
      (location) => location.isPublic === true
    );
    const partnershipsCount = publicLocations.length;

    return {
      organisations: organisationsCount,
      services: servicesCount,
      partnerships: partnershipsCount,
    };
  },
});
