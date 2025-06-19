import { LocationProvider } from '@/contexts/LocationContext';
import FindHelpEntry from '@/components/FindHelp/FindHelpEntry';
import FindHelpResults from '@/components/FindHelp/FindHelpResults';
import type { UIFlattenedService } from '@/types';
import { decodeHtmlEntities } from '@/utils/htmlDecode';
import { categoryKeyToName, subCategoryKeyToName } from '@/utils/categoryLookup';

export default async function FindHelpPage() {
  const baseUrl =
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/services?limit=1000`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch services: ${res.status}`);
  }

  const raw = await res.json();
  const rawArray = raw.results || [];

  if (!Array.isArray(rawArray)) {
    throw new Error('API did not return an array in "results"!');
  }

  // Map services preserving nested organisation object as expected by UIFlattenedService
  const services: UIFlattenedService[] = rawArray.map((item: any) => {
    const coords = item.Address?.Location?.coordinates || [0, 0];
    return {
      id: item._id || item.id, // fallback in case
      name: decodeHtmlEntities(item.ServiceProviderName || item.name || ''),
      description: decodeHtmlEntities(item.Info || item.description || ''),
      category: item.ParentCategoryKey || item.category || '',
      categoryName:
        categoryKeyToName[item.ParentCategoryKey] ||
        item.ParentCategoryKey ||
        '',
      subCategory: item.SubCategoryKey || item.subCategory || '',
      subCategoryName:
        subCategoryKeyToName[item.SubCategoryKey] ||
        item.SubCategoryKey ||
        '',
      latitude: coords[1],
      longitude: coords[0],
      organisation: {
        name: decodeHtmlEntities(
          item.organisation?.name || item.ServiceProviderName || ''
        ),
        slug: item.organisation?.slug || item.ServiceProviderKey || '',
        isVerified: item.organisation?.isVerified || false,
      },
      organisationSlug: item.organisation?.slug || item.ServiceProviderKey || '',
      clientGroups: item.ClientGroups || [],
      openTimes: item.OpeningTimes || [],
    };
  });


  return (
    <LocationProvider>
      <div>
        <FindHelpEntry />
        <FindHelpResults services={services} />
      </div>
    </LocationProvider>
  );
}
