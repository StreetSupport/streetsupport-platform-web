'use client';

import React, { useState } from 'react';
import Accordion from '@/components/ui/Accordion';
import type { OrganisationDetails } from '@/utils/organisation';
import type { FlattenedService } from '@/types';
import { decodeText } from '@/utils/htmlDecode';
import { isServiceOpenNow } from '@/utils/openingTimes';

interface Address {
  Street?: string;
  Street1?: string;
  Street2?: string;
  Street3?: string;
  City?: string;
  Postcode?: string;
  Location?: {
    coordinates: [number, number];
  };
}

interface FlattenedServiceWithAddress extends FlattenedService {
  address?: Address;
}

interface Props {
  organisation: OrganisationDetails;
}

export default function OrganisationServicesAccordion({ organisation }: Props) {
  const groupedServices: Record<string, Record<string, FlattenedServiceWithAddress[]>> =
    organisation.groupedServices || {};
  const parentCategories = Object.keys(groupedServices);

  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  if (parentCategories.length === 0) return null;

  return (
    <section className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Services</h2>

      {parentCategories.map((parent) => {
        const subCats = Object.keys(groupedServices[parent]);

        return (
          <div key={parent} className="mb-6">
            <h3 className="text-lg font-bold mb-2">{parent}</h3>

            {subCats.map((sub) => {
              const service = groupedServices[parent][sub][0];
              const address = service.address || {};
              const fullAddress = [
                address.Street,
                address.Street1,
                address.Street2,
                address.Street3,
                address.City,
                address.Postcode,
              ]
                .filter(Boolean)
                .join(', ');

              const googleMapLink = address.Location?.coordinates
                ? `https://www.google.com/maps?q=${address.Location.coordinates[1]},${address.Location.coordinates[0]}`
                : undefined;

              const appleMapLink = address.Location?.coordinates
                ? `https://maps.apple.com/?ll=${address.Location.coordinates[1]},${address.Location.coordinates[0]}`
                : undefined;

              const key = `${parent}-${sub}`;

              return (
                <Accordion
                  key={key}
                  title={sub}
                  className="mb-4"
                  isOpen={openAccordion === key}
                  onToggle={() => setOpenAccordion(openAccordion === key ? null : key)}
                >
                  {service.description && (
                    <p className="mb-4 whitespace-pre-line">{decodeText(service.description)}</p>
                  )}

                  {fullAddress && (
                    <div className="mb-4">
                      <p className="font-semibold">Address:</p>
                      {googleMapLink ? (
                        <p>
                          <a
                            href={googleMapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {fullAddress}
                          </a>
                          {' | '}
                          {appleMapLink && (
                            <a
                              href={appleMapLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              View on Apple Maps
                            </a>
                          )}
                        </p>
                      ) : (
                        <p>{fullAddress}</p>
                      )}
                    </div>
                  )}

                  {service.openTimes && service.openTimes.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">Opening Times:</p>
                        {(() => {
                          const openingStatus = isServiceOpenNow(service as FlattenedServiceWithAddress);
                          return (
                            <div className="flex items-center gap-2">
                              {openingStatus.isOpen && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Available Now
                                </span>
                              )}
                              {openingStatus.isAppointmentOnly && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Appointment Only
                                </span>
                              )}
                              {!openingStatus.isOpen && openingStatus.nextOpen && (
                                <span className="text-xs text-gray-600">
                                  Next open: {openingStatus.nextOpen.day} {openingStatus.nextOpen.time}
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                      <ul className="list-disc pl-5">
                        {service.openTimes.map((slot, idx) => {
                          const dayIndex = Number(slot.day);
                          const startTime = Number(slot.start);
                          const endTime = Number(slot.end);
                          const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                          return (
                            <li key={idx}>
                              {days[dayIndex] ?? 'Unknown'}: {formatTime(startTime)} – {formatTime(endTime)}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </Accordion>
              );
            })}
          </div>
        );
      })}
    </section>
  );
}

function formatTime(num: number) {
  const str = num.toString().padStart(4, '0');
  return `${str.slice(0, 2)}:${str.slice(2)}`;
}
