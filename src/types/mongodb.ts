/**
 * Raw MongoDB document interfaces matching the shapes returned by
 * aggregation pipelines in the services and service-providers API routes.
 */

export interface RawOpeningTime {
  Day?: number;
  day?: number;
  StartTime?: number;
  start?: number;
  EndTime?: number;
  end?: number;
}

export interface RawServiceAddress {
  Location?: {
    type: string;
    coordinates: [number, number];
  };
  City?: string;
  Street1?: string;
  Street2?: string;
  Street3?: string;
  Postcode?: string;
  IsOpen247?: boolean;
}

export interface RawOrganisation {
  name: string;
  slug: string;
  isVerified: boolean;
  tags?: string[];
}

export interface RawProvidedService {
  _id: unknown;
  id?: unknown;
  name?: string;
  description?: string;
  Info?: string;
  ServiceProviderName?: string;
  ServiceProviderKey?: string;
  ParentCategoryKey?: string;
  SubCategoryKey?: string;
  SubCategoryName?: string;
  IsVerified?: boolean;
  IsTelephoneService?: boolean;
  IsAppointmentOnly?: boolean;
  Address?: RawServiceAddress;
  OpeningTimes?: RawOpeningTime[];
  distance?: number;
  sourceType?: string;
  organisation?: RawOrganisation | null;
  organisationSlug?: string;
  category?: string;
  subCategory?: string;
  provider?: {
    Name: string;
    Key: string;
    IsVerified?: boolean;
    Tags?: string[];
  };
  accommodationData?: Record<string, unknown>;
}

export interface RawServiceFacetResult {
  results: RawProvidedService[];
  totalCount: Array<{ count: number }>;
}
