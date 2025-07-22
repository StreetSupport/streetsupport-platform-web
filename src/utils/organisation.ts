import type { FlattenedService } from '@/types';

// ✅ Address type based on the MongoDB structure
export interface Address {
  Key?: {
    $binary?: {
      base64?: string;
      subType?: string;
    };
  };
  Location?: {
    coordinates?: [number, number];
  };
  Street?: string;
  City?: string;
  Postcode?: string;
  Charity?: string;
  Latitude?: number;
  Longitude?: number;
}

// ✅ Correct type matching your API response shape
export interface OrganisationDetails {
  key: string;
  name: string;
  shortDescription?: string;
  description?: string;
  website?: string;
  telephone?: string;
  email?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  bluesky?: string;
  isVerified?: boolean;
  isPublished?: boolean;
  associatedLocationIds?: string[];
  tags?: string[] | string;
  RegisteredCharity?: number;
  addresses: Address[];
  services: FlattenedService[];
  groupedServices: Record<string, Record<string, FlattenedService[]>>;
}

// ✅ Async API fetcher using your real route
export async function getOrganisationBySlug(
  slug: string
): Promise<OrganisationDetails | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/service-providers/${slug}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) return null;

  const data = await res.json();
  return data.organisation as OrganisationDetails; // ✅ Use .organisation because that’s your API shape
}
