'use client';

import React, { useState } from 'react';
import Accordion from '@/components/ui/Accordion';
import type { OrganisationDetails } from '@/utils/organisation';
import type { FlattenedService } from '@/types';

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
                    <p className="mb-4 whitespace-pre-line">{service.description}</p>
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
                      <p className="font-semibold mb-1">Opening Times:</p>
                      <ul className="list-disc pl-5">
                        {service.openTimes.map((slot, idx) => {
                          const dayIndex = Number(slot.day);
                          const startTime = Number(slot.start);
                          const endTime = Number(slot.end);
                          const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
