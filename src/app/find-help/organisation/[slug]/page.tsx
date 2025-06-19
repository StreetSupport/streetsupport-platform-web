export const dynamic = 'force-dynamic';

import OrganisationShell from './OrganisationShell';
import { notFound } from 'next/navigation';
import { categoryKeyToName, subCategoryKeyToName } from '@/utils/categoryLookup';

import type { RawService } from '@/types/api';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OrganisationPage(props: Props) {
  const { slug } = await props.params;

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/service-providers/${slug}`, {
    cache: 'no-store',
  });

  console.log('✅ ORG SLUG:', slug);
  console.log('✅ API STATUS:', res.status);

  if (!res.ok) {
    console.log('❌ Organisation not found, calling notFound()');
    return notFound();
  }

  const data = await res.json();
  console.log('✅ API RESPONSE:', data);

  if (!data || !data.organisation) {
    console.log('❌ Organisation data missing, calling notFound()');
    return notFound();
  }

  // Cast services
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
      organisation: data.organisation.name,   // ✅ lowercase
      organisationSlug: data.organisation.key, // ✅ lowercase
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
  }, {} as Record<string, Record<string, any[]>>);

  const organisation = {
    ...data.organisation,
    services,
    groupedServices,
  };


  console.log('✅ DEBUG groupedServices:', JSON.stringify(groupedServices, null, 2));

  return <OrganisationShell organisation={organisation} />;
}
