import { NextResponse } from 'next/server';
import services from '@/data/service-providers.json';

export function GET() {
  // Flatten out all services into a flat list with org data
  const allServices = services.flatMap((provider) => {
    return provider.services.map((service) => ({
      ...service,
      organisationId: provider.id,
      organisationName: provider.name,
      postcode: provider.postcode,
      latitude: provider.latitude,
      longitude: provider.longitude,
      locationId: provider.locationId,
      verified: provider.verified
    }));
  });

  return NextResponse.json(allServices);
}
