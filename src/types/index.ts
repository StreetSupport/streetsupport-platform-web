import type { Address } from '@/utils/organisation';

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
  address?: Address;
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
    tags?: string[];
  };
}

// Interface for accommodation data
export interface AccommodationData {
  type: string;
  isOpenAccess: boolean;
  referralRequired: boolean;
  referralNotes: string;
  price: string;
  foodIncluded: number;
  availabilityOfMeals: string;
  features: {
    acceptsHousingBenefit: number;
    acceptsPets: number;
    acceptsCouples: number;
    hasDisabledAccess: number;
    isSuitableForWomen: number;
    isSuitableForYoungPeople: number;
    hasSingleRooms: number;
    hasSharedRooms: number;
    hasShowerBathroomFacilities: number;
    hasAccessToKitchen: number;
    hasLaundryFacilities: number;
    hasLounge: number;
    allowsVisitors: number;
    hasOnSiteManager: number;
    additionalFeatures: string;
  };
  residentCriteria: {
    acceptsMen: boolean;
    acceptsWomen: boolean;
    acceptsCouples: boolean;
    acceptsYoungPeople: boolean;
    acceptsFamilies: boolean;
    acceptsBenefitsClaimants: boolean;
  };
  support: {
    hasOnSiteManager: number;
    supportOffered: string[];
    supportInfo: string;
  };
  contact: {
    name: string;
    telephone: string;
    email: string;
    additionalInfo: string;
  };
  synopsis: string;
  description: string;
}

// Interface for services with accommodation data
export interface ServiceWithAccommodation extends UIFlattenedService {
  sourceType?: string;
  accommodationData?: AccommodationData;
}

// Interface for services with distance calculation from geospatial queries
export interface ServiceWithDistance extends ServiceWithAccommodation {
  distance?: number; // Distance in kilometers, calculated by database or client-side
}

// SWEP (Severe Weather Emergency Protocol) interfaces
export interface SwepData {
  id: string;
  locationSlug: string;
  title: string;
  body: string;
  image?: string;
  shortMessage: string;
  swepActiveFrom: string; // ISO datetime string
  swepActiveUntil: string; // ISO datetime string
  isActive?: boolean; // Computed field based on current datetime
  createdAt?: string; // ISO datetime string
  updatedAt?: string; // ISO datetime string
  createdBy?: string;
  status?: 'draft' | 'published' | 'archived';
  emergencyContact?: {
    phone?: string;
    email?: string;
    hours?: string;
  };
  additionalInfo?: {
    weatherWarning?: string;
    triggerCriteria?: string;
    accommodationCapacity?: number;
    servicesAffected?: string[];
  };
}

// Interface for location data with SWEP information
export interface LocationWithSwep {
  id: string;
  key: string;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  isPublic: boolean;
  swep?: SwepData;
}
