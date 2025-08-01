export const dynamic = 'force-dynamic';

import OrganisationShell from './OrganisationShell';
import { notFound } from 'next/navigation';
import { getCategoryName, getSubCategoryName } from '@/utils/categoryLookup';

import type { RawService } from '@/types/api';
import type { Metadata } from 'next';
import type { Address } from '@/utils/organisation';
import type { FlattenedService } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Shared cache for organisation data to eliminate double API calls
const organisationCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function processOrganisationData(data: { organisation: unknown; services: unknown[] }) {
  const rawServices = (data.services || []) as RawService[];

  const services = rawServices.map((service, idx) => {
    const coords = service.Address?.Location?.coordinates || [0, 0];
    const parentKey = service.ParentCategoryKey || '';
    const subKey = service.SubCategoryKey || '';

    const openTimes = (service.OpeningTimes || []).map((slot: { Day?: number; day?: number; StartTime?: number; start?: number; EndTime?: number; end?: number }) => ({
      day: slot.Day ?? slot.day ?? 0,
      start: slot.StartTime ?? slot.start ?? 0,
      end: slot.EndTime ?? slot.end ?? 0,
    }));

    return {
      id: service._id || `service-${idx}`,
      name: getSubCategoryName(parentKey, subKey) || 'Unnamed Service',
      category: parentKey,
      categoryName: getCategoryName(parentKey) || 'Other',
      subCategory: subKey,
      subCategoryName: getSubCategoryName(parentKey, subKey) || 'Other',
      description: service.Info || '',
      address: service.Address || {},
      openTimes,
      organisation: (data.organisation as { name?: string; key?: string })?.name || 'Unknown Organisation',
      organisationSlug: (data.organisation as { name?: string; key?: string })?.key || '',
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
  }, {} as Record<string, Record<string, FlattenedService[]>>);

  // Extract organisation properties with proper typing
  const orgData = data.organisation as {
    key?: string;
    name?: string;
    shortDescription?: string;
    description?: string;
    website?: string;
    telephone?: string;
    email?: string;
    facebook?: string;
    twitter?: string;
    instagram?: string;
    bluesky?: string;
    isVerified?: boolean;
    isPublished?: boolean;
    associatedLocationIds?: string[];
    tags?: string[] | string;
    RegisteredCharity?: number;
    addresses?: Address[];
  };

  return {
    key: orgData.key || '',
    name: orgData.name || '',
    shortDescription: orgData.shortDescription,
    description: orgData.description,
    website: orgData.website,
    telephone: orgData.telephone,
    email: orgData.email,
    facebook: orgData.facebook,
    twitter: orgData.twitter,
    instagram: orgData.instagram,
    bluesky: orgData.bluesky,
    isVerified: orgData.isVerified,
    isPublished: orgData.isPublished,
    associatedLocationIds: orgData.associatedLocationIds,
    tags: orgData.tags,
    RegisteredCharity: orgData.RegisteredCharity,
    addresses: orgData.addresses || [],
    services,
    groupedServices,
  };
}

async function fetchOrganisationData(slug: string, searchParams?: { [key: string]: string | string[] | undefined }) {
  // Include location parameters in cache key to avoid stale location data
  const locationKey = searchParams?.lat && searchParams?.lng ? 
    `-${searchParams.lat}-${searchParams.lng}-${searchParams.radius || ''}` : '';
  const cacheKey = `org-${slug}${locationKey}`;
  const cached = organisationCache.get(cacheKey);
  
  // Return cached data if it's fresh
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Skip API call if MONGODB_URI is missing (e.g., in CI tests)
  if (!process.env.MONGODB_URI) {
    return null;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  // Build URL with search parameters for location context
  const url = new URL(`${baseUrl}/api/service-providers/${slug}`);
  
  // Add location parameters if available
  if (searchParams) {
    const { lat, lng, radius } = searchParams;
    if (lat && typeof lat === 'string') url.searchParams.set('lat', lat);
    if (lng && typeof lng === 'string') url.searchParams.set('lng', lng);
    if (radius && typeof radius === 'string') url.searchParams.set('radius', radius);
  }
  
  try {
    const res = await fetch(url.toString(), {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    
    // Cache the result
    organisationCache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  
  // Always return a fallback title for E2E tests and error cases
  const fallbackMetadata = {
    title: 'Organisation Not Found | Street Support',
    description: 'The organisation you are looking for could not be found.',
  };
  
  const data = await fetchOrganisationData(slug, searchParams);
  
  if (!data || !data.organisation) {
    return fallbackMetadata;
  }
  
  return {
    title: `${data.organisation.name} | Street Support`,
    description: data.organisation.description || `Services provided by ${data.organisation.name}`,
  };
}

export default async function OrganisationPage(props: Props) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;

  const data = await fetchOrganisationData(slug, searchParams);

  if (!data || !data.organisation) {
    return notFound();
  }

  const organisation = processOrganisationData(data);

  return <OrganisationShell 
    organisation={organisation} 
    userContext={data.userContext} 
  />;
}
