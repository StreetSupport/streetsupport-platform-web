import type { FlattenedService } from '@/types';

export interface Address {
  Key?: {
    $binary?: {
      base64?: string;
      subType?: string;
    };
  };
  Location?: {
    type?: 'Point';
    coordinates?: [number, number];
  };
  Street?: string;
  City?: string;
  Postcode?: string;
  Charity?: string;
  Latitude?: number;
  Longitude?: number;
}

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
}
