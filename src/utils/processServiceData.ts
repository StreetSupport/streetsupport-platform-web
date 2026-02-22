import type { ServiceWithDistance, RawProvidedService } from '@/types';
import { detectAppointmentOnly } from '@/utils/openingTimes';
import { decodeText } from '@/utils/htmlDecode';

export function processServiceData(item: RawProvidedService): ServiceWithDistance {
  const coords = item.Address?.Location?.coordinates ?? [0, 0];

  const openTimes = (item.OpeningTimes ?? []).map((slot) => ({
    day: slot.Day ?? slot.day ?? 0,
    start: slot.StartTime ?? slot.start ?? 0,
    end: slot.EndTime ?? slot.end ?? 0,
  }));

  const name = decodeText(String(item.ServiceProviderName || item.name || ''));
  const description = decodeText(String(item.Info || item.description || ''));
  const orgName = item.organisation
    ? decodeText(String(item.organisation.name || ''))
    : name;

  return {
    id: item._id || item.id,
    name,
    description,
    category: item.ParentCategoryKey || item.category || '',
    subCategory: item.SubCategoryKey || item.subCategory || '',
    latitude: coords[1],
    longitude: coords[0],
    organisation: item.organisation ? {
      name: orgName,
      slug: item.organisation.slug || '',
      isVerified: item.organisation.isVerified || false,
    } : {
      name: orgName,
      slug: item.ServiceProviderKey || '',
      isVerified: item.IsVerified || false,
    },
    organisationSlug: item.organisation ?
      item.organisation.slug || item.ServiceProviderKey || '' :
      item.ServiceProviderKey || '',
    openTimes,
    distance: item.distance,
    isTelephoneService: item.IsTelephoneService || false,
    isAppointmentOnly: item.IsAppointmentOnly ||
      detectAppointmentOnly(
        String(item.Info || item.description || ''),
        String(item.ParentCategoryKey || item.category || ''),
        String(item.SubCategoryKey || item.subCategory || '')
      ),
    isOpen247: item.Address?.IsOpen247 || false,
    sourceType: item.sourceType
  } as ServiceWithDistance;
}
