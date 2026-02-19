import Tooltip from '@/components/ui/Tooltip';
import type { ServiceWithDistance } from '@/types';

interface Props {
  service: ServiceWithDistance;
}

export default function ServiceTypeBadges({ service }: Props) {
  const isPhoneService = service.isTelephoneService ||
    service.subCategory.toLowerCase().includes('telephone') ||
    service.subCategory.toLowerCase().includes('phone') ||
    service.subCategory.toLowerCase().includes('helpline');

  const is24Hour = service.openTimes?.length > 0 && service.openTimes.some(slot => {
    const startTime = Number(slot.start);
    const endTime = Number(slot.end);
    return startTime === 0 && endTime === 2359;
  });

  const isAccommodation = service.category === 'accom' || service.sourceType === 'accommodation';
  const accommodationData = service.accommodationData;

  const hasAnyBadge = isPhoneService || is24Hour || isAccommodation ||
    service.isOpen247 || service.isAppointmentOnly;

  if (!hasAnyBadge) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {isPhoneService && (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          Phone Service
        </span>
      )}
      {service.isOpen247 && (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
          Open 24/7
        </span>
      )}
      {service.isAppointmentOnly && (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Call before attending
        </span>
      )}
      {isAccommodation && accommodationData && (
        <>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {accommodationData.type === 'supported' ? 'Supported' :
             accommodationData.type === 'emergency' ? 'Emergency' :
             accommodationData.type === 'hostel' ? 'Hostel' :
             accommodationData.type === 'social' ? 'Social Housing' :
             accommodationData.type || 'Accommodation'}
          </span>
          {accommodationData.referralRequired && (
            <Tooltip
              content={accommodationData.referralNotes ?
                `Referral required: ${accommodationData.referralNotes}` :
                "A referral is required for this accommodation. Contact the organisation to find out how to obtain a referral."}
              position="bottom"
            >
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-help bg-brand-j text-white">
                Referral Required
              </span>
            </Tooltip>
          )}
          {accommodationData.isOpenAccess && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-brand-b text-white">
              Open Access
            </span>
          )}
        </>
      )}
    </div>
  );
}
