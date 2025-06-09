import { NextResponse } from 'next/server';
import services from '@/data/service-providers.json';

export function GET() {
  const allServices = services.flatMap((provider) => {
    return provider.services.map((service) => ({
      ...service,
      organisationId: provider.id,
      organisationName: provider.name,
      postcode: provider.postcode,
      latitude: provider.latitude,
      longitude: provider.longitude,
      verified: provider.verified
    }));
  });

  return NextResponse.json(allServices);
}
