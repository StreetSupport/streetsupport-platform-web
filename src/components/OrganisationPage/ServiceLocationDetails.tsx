import MarkdownContent from '@/components/ui/MarkdownContent';
import OpeningTimesList from '@/components/ui/OpeningTimesList';
import ServiceTypeBadges from './ServiceTypeBadges';
import AccommodationDetails from './AccommodationDetails';
import ServiceAddress from './ServiceAddress';
import type { ServiceWithDistance } from '@/types';
import type { Address } from '@/utils/organisation';
import { isServiceOpenNow } from '@/utils/openingTimes';

type ServiceLocation = {
  address: Address;
  distance: number;
  service: ServiceWithDistance;
};

interface Props {
  location: ServiceLocation;
  accordionKey: string;
  expandedDescriptions: Record<string, boolean>;
  onToggleExpanded: (key: string) => void;
}

export default function ServiceLocationDetails({
  location,
  accordionKey,
  expandedDescriptions,
  onToggleExpanded,
}: Props) {
  const service = location.service;

  return (
    <>
      <ServiceTypeBadges service={service} />

      {service?.description && (
        <div className="mb-4">
          <MarkdownContent content={service.description} />
        </div>
      )}

      {service.category === 'accom' && service.accommodationData && (
        <div className="mb-4">
          <AccommodationDetails
            accommodationData={service.accommodationData}
            accordionKey={accordionKey}
            expandedDescriptions={expandedDescriptions}
            onToggleExpanded={onToggleExpanded}
          />
        </div>
      )}

      <ServiceAddress address={location.address} />

      {service?.openTimes && service.openTimes.length > 0 && !service.isOpen247 && (
        <OpeningTimesSection service={service} />
      )}
    </>
  );
}

function OpeningTimesSection({ service }: { service: ServiceWithDistance }) {
  const openingStatus = isServiceOpenNow(service);

  const isPhoneService = service.isTelephoneService ||
    service.subCategory.toLowerCase().includes('telephone') ||
    service.subCategory.toLowerCase().includes('phone') ||
    service.subCategory.toLowerCase().includes('helpline');

  const is24Hour = service.isOpen247 || service.openTimes.some(slot => {
    const startTime = Number(slot.start);
    const endTime = Number(slot.end);
    return startTime === 0 && endTime === 2359;
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <p className="font-semibold">Opening Times:</p>
        <div className="flex items-center flex-wrap gap-2">
          {openingStatus.isOpen && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Open Now
            </span>
          )}
          {openingStatus.isAppointmentOnly && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Call before attending
            </span>
          )}
          {isPhoneService && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              Phone Service
            </span>
          )}
          {is24Hour && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              24 Hours
            </span>
          )}
          {!openingStatus.isOpen && openingStatus.nextOpen && (
            <span className="text-xs text-gray-600">
              Next open: {openingStatus.nextOpen.day} {openingStatus.nextOpen.time}
            </span>
          )}
        </div>
      </div>
      <OpeningTimesList openTimes={service.openTimes} className="list-disc pl-5" />
    </div>
  );
}
