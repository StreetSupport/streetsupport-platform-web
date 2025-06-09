import providers from '@/data/service-providers.json';
import type { ServiceProvider, FlattenedService } from '@/types';

export interface OrganisationDetails extends ServiceProvider {
  groupedServices: Record<string, FlattenedService[]>;
}

export function getOrganisationBySlug(slug: string): OrganisationDetails | null {
  const list = providers as ServiceProvider[];
  const provider = list.find((p) => p.slug === slug);
  if (!provider) return null;

  const grouped: Record<string, FlattenedService[]> = {};

  if (Array.isArray(provider.services)) {
    provider.services.forEach((s) => {
      const cat = s.category || 'Other';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({
        ...s,
        organisation: provider.name,
        organisationSlug: provider.slug,
      });
    });
  }

  return { ...provider, groupedServices: grouped };
}
