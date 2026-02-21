import type { ServiceWithDistance } from '@/types';
import { detectAppointmentOnly } from '@/utils/openingTimes';
import { decodeText } from '@/utils/htmlDecode';

export function processServiceData(item: unknown): ServiceWithDistance {
  const serviceItem = item as Record<string, unknown>;
  const coords = ((serviceItem.Address as Record<string, unknown>)?.Location as Record<string, unknown>)?.coordinates as number[] || [0, 0];

  const openTimes = (serviceItem.OpeningTimes as Array<{ Day?: number; day?: number; StartTime?: number; start?: number; EndTime?: number; end?: number }> || []).map((slot) => ({
    day: slot.Day ?? slot.day ?? 0,
    start: slot.StartTime ?? slot.start ?? 0,
    end: slot.EndTime ?? slot.end ?? 0,
  }));

  const name = decodeText(String(serviceItem.ServiceProviderName || serviceItem.name || ''));
  const description = decodeText(String(serviceItem.Info || serviceItem.description || ''));
  const orgName = serviceItem.organisation
    ? decodeText(String((serviceItem.organisation as Record<string, unknown>).name || ''))
    : name;

  return {
    id: serviceItem._id || serviceItem.id,
    name,
    description,
    category: serviceItem.ParentCategoryKey || serviceItem.category || '',
    subCategory: serviceItem.SubCategoryKey || serviceItem.subCategory || '',
    latitude: coords[1],
    longitude: coords[0],
    organisation: serviceItem.organisation ? {
      name: orgName,
      slug: (serviceItem.organisation as Record<string, unknown>).slug || '',
      isVerified: (serviceItem.organisation as Record<string, unknown>).isVerified || false,
    } : {
      name: orgName,
      slug: serviceItem.ServiceProviderKey || '',
      isVerified: (serviceItem.IsVerified as boolean) || false,
    },
    organisationSlug: serviceItem.organisation ?
      (serviceItem.organisation as Record<string, unknown>).slug || serviceItem.ServiceProviderKey || '' :
      serviceItem.ServiceProviderKey || '',
    openTimes,
    distance: serviceItem.distance,
    isTelephoneService: (serviceItem.IsTelephoneService as boolean) || false,
    isAppointmentOnly: (serviceItem.IsAppointmentOnly as boolean) ||
      detectAppointmentOnly(
        String(serviceItem.Info || serviceItem.description || ''),
        String(serviceItem.ParentCategoryKey || serviceItem.category || ''),
        String(serviceItem.SubCategoryKey || serviceItem.subCategory || '')
      ),
    isOpen247: (serviceItem.Address as Record<string, unknown>)?.IsOpen247 as boolean || false,
    sourceType: serviceItem.sourceType
  } as ServiceWithDistance;
}
