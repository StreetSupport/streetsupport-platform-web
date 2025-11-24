import { getClientPromise } from '@/utils/mongodb';
import { decodeText } from '@/utils/htmlDecode';

// Interface for the database document structure
interface TemporaryAccommodationDocument {
  _id: string;
  GeneralInfo: {
    Name: string;
    Synopsis?: string;
    Description?: string;
    AccommodationType: string;
    ServiceProviderId: string;
    ServiceProviderName: string;
    IsOpenAccess: boolean;
    IsPubliclyVisible?: boolean;
    IsPublished?: boolean;
    IsVerified?: boolean;
  };
  PricingAndRequirementsInfo: {
    ReferralIsRequired: boolean;
    ReferralNotes?: string;
    Price: string;
    FoodIsIncluded: number;
    AvailabilityOfMeals?: string;
  };
  ContactInformation: {
    Name?: string;
    Email?: string;
    Telephone?: string;
    AdditionalInfo?: string;
  };
  Address: {
    Street1?: string;
    Street2?: string;
    Street3?: string;
    City?: string;
    Postcode?: string;
    Location?: {
      type: string;
      coordinates: [number, number];
    };
    AssociatedCityId?: string;
  };
  FeaturesWithDiscretionary: {
    AcceptsHousingBenefit?: number;
    AcceptsPets?: number;
    AcceptsCouples?: number;
    HasDisabledAccess?: number;
    IsSuitableForWomen?: number;
    IsSuitableForYoungPeople?: number;
    HasSingleRooms?: number;
    HasSharedRooms?: number;
    HasShowerBathroomFacilities?: number;
    HasAccessToKitchen?: number;
    HasLaundryFacilities?: number;
    HasLounge?: number;
    AllowsVisitors?: number;
    HasOnSiteManager?: number;
    AdditionalFeatures?: string;
  };
  ResidentCriteriaInfo: {
    AcceptsMen?: boolean;
    AcceptsWomen?: boolean;
    AcceptsCouples?: boolean;
    AcceptsYoungPeople?: boolean;
    AcceptsFamilies?: boolean;
    AcceptsBenefitsClaimants?: boolean;
  };
  SupportProvidedInfo: {
    HasOnSiteManager?: number;
    SupportOffered?: string[];
    SupportInfo?: string;
  };
}

// Interface for the transformed accommodation data (matching JSON structure)
export interface AccommodationData {
  id: string;
  name: string;
  synopsis: string;
  description: string;
  serviceProviderId: string;
  serviceProviderName: string;
  isVerified: boolean;
  address: {
    street1: string;
    street2: string;
    street3: string;
    city: string;
    postcode: string;
    latitude: number;
    longitude: number;
    associatedCityId: string;
  };
  contact: {
    name: string;
    telephone: string;
    email: string;
    additionalInfo: string;
  };
  accommodation: {
    type: string;
    isOpenAccess: boolean;
    referralRequired: boolean;
    referralNotes: string;
    price: string;
    foodIncluded: number;
    availabilityOfMeals: string;
  };
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
}

// Transform database document to JSON-compatible format
function transformDatabaseDocumentToAccommodationData(doc: TemporaryAccommodationDocument): AccommodationData {
  return {
    id: doc._id,
    name: decodeText(doc.GeneralInfo?.Name || ''),
    synopsis: decodeText(doc.GeneralInfo?.Synopsis || ''),
    description: decodeText(doc.GeneralInfo?.Description || ''),
    serviceProviderId: doc.GeneralInfo?.ServiceProviderId || '',
    serviceProviderName: doc.GeneralInfo?.ServiceProviderName || '',
    isVerified: doc.GeneralInfo?.IsVerified || false,
    address: {
      street1: decodeText(doc.Address?.Street1 || ''),
      street2: decodeText(doc.Address?.Street2 || ''),
      street3: decodeText(doc.Address?.Street3 || ''),
      city: decodeText(doc.Address?.City || ''),
      postcode: decodeText(doc.Address?.Postcode || ''),
      latitude: doc.Address?.Location?.coordinates?.[1] || 0,
      longitude: doc.Address?.Location?.coordinates?.[0] || 0,
      associatedCityId: doc.Address?.AssociatedCityId || '',
    },
    contact: {
      name: decodeText(doc.ContactInformation?.Name || ''),
      telephone: decodeText(doc.ContactInformation?.Telephone || ''),
      email: decodeText(doc.ContactInformation?.Email || ''),
      additionalInfo: decodeText(doc.ContactInformation?.AdditionalInfo || ''),
    },
    accommodation: {
      type: doc.GeneralInfo?.AccommodationType || 'other',
      isOpenAccess: doc.GeneralInfo?.IsOpenAccess || false,
      referralRequired: doc.PricingAndRequirementsInfo?.ReferralIsRequired || false,
      referralNotes: decodeText(doc.PricingAndRequirementsInfo?.ReferralNotes || ''),
      price: doc.PricingAndRequirementsInfo?.Price || '0',
      foodIncluded: doc.PricingAndRequirementsInfo?.FoodIsIncluded || 2,
      availabilityOfMeals: decodeText(doc.PricingAndRequirementsInfo?.AvailabilityOfMeals || ''),
    },
    features: {
      acceptsHousingBenefit: doc.FeaturesWithDiscretionary?.AcceptsHousingBenefit || 2,
      acceptsPets: doc.FeaturesWithDiscretionary?.AcceptsPets || 2,
      acceptsCouples: doc.FeaturesWithDiscretionary?.AcceptsCouples || 2,
      hasDisabledAccess: doc.FeaturesWithDiscretionary?.HasDisabledAccess || 2,
      isSuitableForWomen: doc.FeaturesWithDiscretionary?.IsSuitableForWomen || 2,
      isSuitableForYoungPeople: doc.FeaturesWithDiscretionary?.IsSuitableForYoungPeople || 2,
      hasSingleRooms: doc.FeaturesWithDiscretionary?.HasSingleRooms || 2,
      hasSharedRooms: doc.FeaturesWithDiscretionary?.HasSharedRooms || 2,
      hasShowerBathroomFacilities: doc.FeaturesWithDiscretionary?.HasShowerBathroomFacilities || 2,
      hasAccessToKitchen: doc.FeaturesWithDiscretionary?.HasAccessToKitchen || 2,
      hasLaundryFacilities: doc.FeaturesWithDiscretionary?.HasLaundryFacilities || 2,
      hasLounge: doc.FeaturesWithDiscretionary?.HasLounge || 2,
      allowsVisitors: doc.FeaturesWithDiscretionary?.AllowsVisitors || 2,
      hasOnSiteManager: doc.FeaturesWithDiscretionary?.HasOnSiteManager || 2,
      additionalFeatures: decodeText(doc.FeaturesWithDiscretionary?.AdditionalFeatures || ''),
    },
    residentCriteria: {
      acceptsMen: doc.ResidentCriteriaInfo?.AcceptsMen || false,
      acceptsWomen: doc.ResidentCriteriaInfo?.AcceptsWomen || false,
      acceptsCouples: doc.ResidentCriteriaInfo?.AcceptsCouples || false,
      acceptsYoungPeople: doc.ResidentCriteriaInfo?.AcceptsYoungPeople || false,
      acceptsFamilies: doc.ResidentCriteriaInfo?.AcceptsFamilies || false,
      acceptsBenefitsClaimants: doc.ResidentCriteriaInfo?.AcceptsBenefitsClaimants || false,
    },
    support: {
      hasOnSiteManager: doc.SupportProvidedInfo?.HasOnSiteManager || 2,
      supportOffered: doc.SupportProvidedInfo?.SupportOffered || [],
      supportInfo: decodeText(doc.SupportProvidedInfo?.SupportInfo || ''),
    },
  };
}


// Load accommodation data with filtering (optimized for find-help searches)
export async function loadFilteredAccommodationData({
  location,
  category,
  subcategory,
  latitude,
  longitude,
  radiusKm
}: {
  location?: string;
  category?: string;
  subcategory?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
}): Promise<AccommodationData[]> {
  try {
    // If not searching for accommodation category, return empty array early
    if (category && category.toLowerCase() !== 'accom') {
      return [];
    }

    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const tempAccomCol = db.collection('TemporaryAccommodation');
    
    // Build query with filters
    const query: Record<string, unknown> & { $and: Array<Record<string, unknown>> } = {
      $and: [
        { 
          'GeneralInfo.ServiceProviderId': { 
            $exists: true, 
            $nin: [null, ''], // Use $nin instead of multiple $ne
            $type: 'string' // Ensure it's actually a string, not null
          } 
        },
        {
          $or: [
            { 'GeneralInfo.IsPubliclyVisible': true },
            { 'GeneralInfo.IsPublished': true },
            { 
              'GeneralInfo.IsPublished': { $exists: false },
              'GeneralInfo.IsPubliclyVisible': { $ne: false }
            }
          ]
        }
      ]
    };

    // Add location filter
    if (location) {
      query.$and.push({
        'Address.City': { $regex: new RegExp(`^${location}`, 'i') }
      });
    }

    // Add subcategory filter
    if (subcategory) {
      query.$and.push({
        'GeneralInfo.AccommodationType': { $regex: new RegExp(`^${subcategory}`, 'i') }
      });
    }

    // Add geospatial filtering if coordinates provided
    if (latitude !== undefined && longitude !== undefined && radiusKm !== undefined) {
      query.$and.push({
        'Address.Location': {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radiusKm / 6371] // Earth radius in km
          }
        }
      });
    }
    
    const documents = await tempAccomCol.find(query).toArray() as unknown as TemporaryAccommodationDocument[];
    
    // Transform documents to match the expected JSON structure
    const transformedData = documents.map(transformDatabaseDocumentToAccommodationData);
    
    return transformedData;
  } catch (error) {
    console.error('❌ Error loading filtered accommodation data:', error);
    return [];
  }
}

// Load accommodation data for a specific service provider
export async function loadAccommodationDataForProvider(serviceProviderId: string): Promise<AccommodationData[]> {
  try {
    const client = await getClientPromise();
    const db = client.db('streetsupport');
    const tempAccomCol = db.collection('TemporaryAccommodation');
    
    const query = {
      'GeneralInfo.ServiceProviderId': serviceProviderId,
      $or: [
        { 'GeneralInfo.IsPubliclyVisible': true },
        { 'GeneralInfo.IsPublished': true },
        { 
          'GeneralInfo.IsPublished': { $exists: false },
          'GeneralInfo.IsPubliclyVisible': { $ne: false }
        }
      ]
    };
    
    const documents = await tempAccomCol.find(query).toArray() as unknown as TemporaryAccommodationDocument[];
    
    // Transform documents to match the expected JSON structure
    const transformedData = documents.map(transformDatabaseDocumentToAccommodationData);
    
    return transformedData;
  } catch (error) {
    console.error(`❌ Error loading accommodation data for provider ${serviceProviderId}:`, error);
    return [];
  }
}