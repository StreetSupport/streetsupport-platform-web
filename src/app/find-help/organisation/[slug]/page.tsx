export const dynamic = 'force-dynamic';

import OrganisationShell from './OrganisationShell';
import { notFound } from 'next/navigation';
import { categoryKeyToName, subCategoryKeyToName } from '@/utils/categoryLookup';

import type { RawService } from '@/types/api';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  
  // Always return a fallback title for E2E tests and error cases
  // This ensures the page always has a title, even when the API fails
  const fallbackMetadata = {
    title: 'Organisation Not Found | Street Support',
    description: 'The organisation you are looking for could not be found.',
  };
  
  // Skip API call if MONGODB_URI is missing (e.g., in CI tests)
  if (!process.env.MONGODB_URI) {
    return fallbackMetadata;
  }
  
  // ✅ Use absolute URL for server fetch
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const res = await fetch(`${baseUrl}/api/service-providers/${slug}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return fallbackMetadata;
    }
    
    const data = await res.json();
    
    if (!data || !data.organisation) {
      return fallbackMetadata;
    }
    
    return {
      title: `${data.organisation.name} | Street Support`,
      description: data.organisation.description || `Services provided by ${data.organisation.name}`,
    };
  } catch {
    return fallbackMetadata;
  }
}

export default async function OrganisationPage(props: Props) {
  const { slug } = await props.params;

  // ✅ Use absolute URL for server fetch
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/service-providers/${slug}`, {
    cache: 'no-store',
  });


  if (!res.ok) {
    return notFound();
  }

  const data = await res.json();

  if (!data || !data.organisation) {
    return notFound();
  }

  const rawServices = (data.services || []) as RawService[];

  const services = rawServices.map((service, idx) => {
    const coords = service.Address?.Location?.coordinates || [0, 0];
    const parentKey = service.ParentCategoryKey || '';
    const subKey = service.SubCategoryKey || '';

    const openTimes = (service.OpeningTimes || []).map(slot => ({
      day: slot.day,
      start: slot.start,
      end: slot.end,
    }));

    return {
      id: service._id || `service-${idx}`,
      name: subCategoryKeyToName[subKey] || subKey || 'Unnamed Service',
      category: parentKey,
      categoryName: categoryKeyToName[parentKey] || parentKey || 'Other',
      subCategory: subKey,
      subCategoryName: subCategoryKeyToName[subKey] || subKey || 'Other',
      description: service.Info || '',
      address: service.Address || {},
      openTimes,
      organisation: data.organisation.name,
      organisationSlug: data.organisation.key,
      latitude: coords[1],
      longitude: coords[0],
      clientGroups: service.ClientGroups || [],
    };
  });

  const groupedServices = services.reduce((acc, s) => {
    const parent = s.categoryName || 'Other';
    const sub = s.subCategoryName || 'Other';

    if (!acc[parent]) acc[parent] = {};
    if (!acc[parent][sub]) acc[parent][sub] = [];
    acc[parent][sub].push(s);

    return acc;
  }, {} as Record<string, Record<string, unknown[]>>);

  const organisation = {
    ...data.organisation,
    services,
    groupedServices,
  };


  return <OrganisationShell organisation={organisation} />;
}
