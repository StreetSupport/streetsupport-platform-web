export interface ServiceProvider {
  id: string;
  name: string;
  slug:string;
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
  organisation: string;
  organisationSlug: string;
  description: string;
  openTimes: { day: string; start: string; end: string }[];
  clientGroups: string[];
  latitude: number;
  longitude: number;
}
