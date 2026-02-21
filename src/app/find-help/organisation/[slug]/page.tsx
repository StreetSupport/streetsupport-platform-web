export const revalidate = 1800;

import { cache } from 'react';
import OrganisationShell from './OrganisationShell';
import { notFound } from 'next/navigation';
import { getCategoryName, getSubCategoryName } from '@/utils/categoryLookup';

import type { RawService } from '@/types/api';
import type { Metadata } from 'next';
import type { Address } from '@/utils/organisation';

interface Props {
  params: Promise<{ slug: string }>;
}

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
      isAppointmentOnly: service.isAppointmentOnly,
      isTelephoneService: service.isTelephoneService,
      isOpen247: service.isOpen247,
      ...(service.accommodationData && { accommodationData: service.accommodationData }),
      ...(service.sourceType && { sourceType: service.sourceType }),
    };
  });

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
  };
}

const getOrganisationData = cache(async (slug: string) => {
  if (!process.env.MONGODB_URI) {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${baseUrl}/api/service-providers/${slug}`, {
      next: { revalidate: 1800 },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch {
    return null;
  }
});

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;

  const data = await getOrganisationData(slug);

  if (!data || !data.organisation) {
    notFound();
  }

  return {
    title: `${data.organisation.name} | Street Support`,
    description: data.organisation.description || `Services provided by ${data.organisation.name}`,
  };
}

export default async function OrganisationPage(props: Props) {
  const { slug } = await props.params;

  const data = await getOrganisationData(slug);

  if (!data || !data.organisation) {
    return notFound();
  }

  const organisation = processOrganisationData(data);

  return <OrganisationShell organisation={organisation} />;
}
