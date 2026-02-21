import React from 'react';
import type { Address } from '@/utils/organisation';
import type { ServiceWithDistance } from '@/types';
import { decodeText } from '@/utils/htmlDecode';
import { isServiceOpenNow } from '@/utils/openingTimes';

type ServiceLocation = {
  address: Address;
  distance: number;
  service: ServiceWithDistance;
};

interface Props {
  locations: ServiceLocation[];
  selectedIndex: number;
  onSelectLocation: (index: number) => void;
  onLocationClick?: (lat: number, lng: number) => void;
  renderDetails: (location: ServiceLocation) => React.ReactNode;
}

function formatAddress(address: Address): string {
  const parts = [
    address.Street,
    address.City,
    address.Postcode,
  ]
    .filter(Boolean)
    .map(part => decodeText(part!));

  return parts.join(', ');
}

export default function ServiceLocationPicker({
  locations,
  selectedIndex,
  onSelectLocation,
  onLocationClick,
  renderDetails,
}: Props) {
  return (
    <div className="mb-4">
      <p className="font-semibold mb-2 text-sm">Available at {locations.length} locations:</p>
      <div className="space-y-2">
        {locations.map((location, locationIndex) => {
          const fullAddress = formatAddress(location.address);
          const isSelected = selectedIndex === locationIndex;
          const service = location.service;
          const openingStatus = isServiceOpenNow(service);

          return (
            <React.Fragment key={locationIndex}>
              <button
                type="button"
                onClick={() => {
                  onSelectLocation(locationIndex);
                  const coordinates = location.address.Location?.coordinates;
                  if (onLocationClick && coordinates) {
                    onLocationClick(coordinates[1], coordinates[0]);
                  }
                }}
                className={`location-btn w-full px-3 py-3 rounded-lg border text-sm transition-colors${isSelected ? ' selected' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs mt-0.5 flex-shrink-0">{'\uD83D\uDCCD'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-left break-words">{fullAddress || 'Unknown Address'}</div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1 text-xs">
                      <div className="flex items-center gap-3">
                        {location.distance !== Infinity && (
                          <span className="text-gray-500 flex-shrink-0">{location.distance.toFixed(1)} km</span>
                        )}
                        <LocationOpenStatus service={service} openingStatus={openingStatus} />
                      </div>
                      {!openingStatus.isOpen && openingStatus.nextOpen && (
                        <span className="text-gray-400 flex-shrink-0">
                          Next: {openingStatus.nextOpen.day} {openingStatus.nextOpen.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {isSelected && (
                <div className="pl-4 border-l-2 mt-1 mb-2 border-brand-a">
                  {renderDetails(location)}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function LocationOpenStatus({
  service,
  openingStatus,
}: {
  service: ServiceWithDistance;
  openingStatus: ReturnType<typeof isServiceOpenNow>;
}) {
  const hasOpenTimes = service.openTimes && service.openTimes.length > 0;
  const is24Hour = hasOpenTimes && service.openTimes.some(slot => {
    const startTime = Number(slot.start);
    const endTime = Number(slot.end);
    return startTime === 0 && endTime === 2359;
  });

  return (
    <div className="flex items-center gap-1">
      {hasOpenTimes && !is24Hour && (
        <>
          {openingStatus.isOpen && <span className="text-green-600">{'\u25CF'} Open</span>}
          {!openingStatus.isOpen && <span className="text-gray-500">{'\u25CF'} Closed</span>}
        </>
      )}
      {service.isOpen247 && <span className="text-green-600">{'\u25CF'} Open 24/7</span>}
    </div>
  );
}
