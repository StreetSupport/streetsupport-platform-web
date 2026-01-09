'use client';

import React from 'react';

interface OpeningTime {
  StartTime: number;
  EndTime: number;
  Day: number;
}

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

interface Service {
  id: string;
  Info?: string;          // ✅ match ProvidedServices field name
  Description?: string;   // ✅ fallback if Info is not there
  Address?: Address;
  OpeningTimes?: OpeningTime[];
}

export default function OrganisationServiceDetails({ service }: { service: Service }) {
  const { Info, Description, Address, OpeningTimes } = service;

  const text = Info || Description || 'No description available.';

  const fullAddress = [
    Address?.Street,
    Address?.Street1,
    Address?.Street2,
    Address?.Street3,
    Address?.City,
    Address?.Postcode,
  ]
    .filter(Boolean)
    .join(', ');

  const mapLink = Address?.Location?.coordinates
    ? `https://www.google.com/maps?q=${Address.Location.coordinates[1]},${Address.Location.coordinates[0]}`
    : null;

  // Database uses Monday-first indexing: 0=Monday, ..., 6=Sunday
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div>
      {text && (
        <p className="mb-2 whitespace-pre-line">{text}</p>
      )}

      {fullAddress && (
        <p className="mb-2">
          <strong>Address:</strong>{' '}
          {mapLink ? (
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {fullAddress}
            </a>
          ) : (
            fullAddress
          )}
        </p>
      )}

      {OpeningTimes && OpeningTimes.length > 0 && (
        <div>
          <p className="font-semibold mb-1">Opening Times:</p>
          <ul className="list-disc pl-5">
            {OpeningTimes.map((slot, idx) => (
              <li key={idx}>
                {days[slot.Day]}: {formatTime(slot.StartTime)} – {formatTime(slot.EndTime)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatTime(num: number) {
  const str = num.toString().padStart(4, '0');
  return `${str.slice(0, 2)}:${str.slice(2)}`;
}
