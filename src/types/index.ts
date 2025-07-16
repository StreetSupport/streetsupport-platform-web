export interface ServiceProvider {
  id: string;
  name: string;
  slug: string;
  postcode: string;
  latitude: number;
  longitude: number;
  verified: boolean;
  published: boolean;
  disabled: boolean;
  services: FlattenedService[];
}

export interface FlattenedService {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  organisation: string;       // flat string, e.g. organisation name
  organisationSlug: string;
  description: string;
  openTimes: { day: number; start: number; end: number }[];  // changed to number
  clientGroups: string[];
  latitude: number;
  longitude: number;
}

// New interface for UI components expecting nested organisation object
export interface UIFlattenedService extends Omit<FlattenedService, 'organisation'> {
  organisation: {
    name: string;
    slug: string;
    isVerified?: boolean;
  };
}

// Interface for services with distance calculation from geospatial queries
export interface ServiceWithDistance extends UIFlattenedService {
  distance?: number; // Distance in kilometers, calculated by database or client-side
}
