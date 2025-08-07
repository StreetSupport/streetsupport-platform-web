/**
 * @jest-environment node
 */

import { 
  loadFilteredAccommodationData, 
  loadAccommodationDataForProvider,
  type AccommodationData 
} from '@/utils/accommodationData';

// Mock MongoDB and dependencies
const mockFind = jest.fn();
const mockToArray = jest.fn();
const mockCollection = jest.fn();
const mockDb = jest.fn();
const mockConnect = jest.fn();
const mockClose = jest.fn();

const mockClient = {
  connect: mockConnect,
  close: mockClose,
  db: mockDb
};

jest.mock('@/utils/mongodb', () => ({
  getClientPromise: jest.fn(() => Promise.resolve(mockClient))
}));

jest.mock('@/utils/htmlDecode', () => ({
  decodeText: jest.fn((text: string) => text) // Return text as-is for testing
}));

describe('accommodationData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock chain
    mockToArray.mockResolvedValue([]);
    mockFind.mockReturnValue({ toArray: mockToArray });
    mockCollection.mockReturnValue({ find: mockFind });
    mockDb.mockReturnValue({ collection: mockCollection });
    mockConnect.mockResolvedValue(undefined);
    mockClose.mockResolvedValue(undefined);
  });

  describe('loadFilteredAccommodationData', () => {
    const mockAccommodationDocument = {
      _id: '507f1f77bcf86cd799439011',
      GeneralInfo: {
        Name: 'Test Accommodation',
        Synopsis: 'Test synopsis',
        Description: 'Test description',
        AccommodationType: 'supported',
        ServiceProviderId: 'test-provider-123',
        IsOpenAccess: true,
        IsPubliclyVisible: true,
        IsPublished: true
      },
      PricingAndRequirementsInfo: {
        ReferralIsRequired: false,
        ReferralNotes: 'No referral needed',
        Price: '50',
        FoodIsIncluded: 1,
        AvailabilityOfMeals: 'Breakfast and dinner'
      },
      ContactInformation: {
        Name: 'John Doe',
        Email: 'john@example.com',
        Telephone: '0161 123 4567',
        AdditionalInfo: 'Call between 9-5'
      },
      Address: {
        Street1: '123 Test Street',
        Street2: 'Test Area',
        Street3: '',
        City: 'Manchester',
        Postcode: 'M1 1AA',
        Location: {
          type: 'Point',
          coordinates: [-2.2426, 53.4808]
        },
        AssociatedCityId: 'manchester'
      },
      FeaturesWithDiscretionary: {
        AcceptsHousingBenefit: 1,
        AcceptsPets: 0, // This will become 2 due to || fallback
        AcceptsCouples: 1,
        HasDisabledAccess: 1,
        IsSuitableForWomen: 1,
        IsSuitableForYoungPeople: 0, // This will become 2 due to || fallback
        HasSingleRooms: 1,
        HasSharedRooms: 0, // This will become 2 due to || fallback
        HasShowerBathroomFacilities: 1,
        HasAccessToKitchen: 1,
        HasLaundryFacilities: 1,
        HasLounge: 1,
        AllowsVisitors: 1,
        HasOnSiteManager: 1,
        AdditionalFeatures: 'WiFi available'
      },
      ResidentCriteriaInfo: {
        AcceptsMen: false,
        AcceptsWomen: true,
        AcceptsCouples: true,
        AcceptsYoungPeople: false,
        AcceptsFamilies: false,
        AcceptsBenefitsClaimants: true
      },
      SupportProvidedInfo: {
        HasOnSiteManager: 1,
        SupportOffered: ['mental health', 'substance abuse'],
        SupportInfo: 'We provide comprehensive support'
      }
    };

    it('should return empty array when category is not accom', async () => {
      const result = await loadFilteredAccommodationData({
        category: 'food'
      });

      expect(result).toEqual([]);
      expect(mockCollection).not.toHaveBeenCalled();
    });

    it('should fetch accommodation data with basic filters', async () => {
      mockToArray.mockResolvedValue([mockAccommodationDocument]);

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      expect(mockCollection).toHaveBeenCalledWith('TemporaryAccommodation');
      expect(mockFind).toHaveBeenCalledWith({
        $and: [
          {
            'GeneralInfo.ServiceProviderId': {
              $exists: true,
              $nin: [null, ''],
              $type: 'string'
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
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: '507f1f77bcf86cd799439011',
        name: 'Test Accommodation',
        synopsis: 'Test synopsis',
        description: 'Test description',
        serviceProviderId: 'test-provider-123'
      });
    });

    it('should add location filter when provided', async () => {
      mockToArray.mockResolvedValue([]);

      await loadFilteredAccommodationData({
        category: 'accom',
        location: 'Manchester'
      });

      expect(mockFind).toHaveBeenCalledWith({
        $and: [
          {
            'GeneralInfo.ServiceProviderId': {
              $exists: true,
              $nin: [null, ''],
              $type: 'string'
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
          },
          {
            'Address.City': { $regex: /^Manchester/i }
          }
        ]
      });
    });

    it('should add subcategory filter when provided', async () => {
      mockToArray.mockResolvedValue([]);

      await loadFilteredAccommodationData({
        category: 'accom',
        subcategory: 'emergency'
      });

      expect(mockFind).toHaveBeenCalledWith({
        $and: [
          {
            'GeneralInfo.ServiceProviderId': {
              $exists: true,
              $nin: [null, ''],
              $type: 'string'
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
          },
          {
            'GeneralInfo.AccommodationType': { $regex: /^emergency/i }
          }
        ]
      });
    });

    it('should add geospatial filter when coordinates provided', async () => {
      mockToArray.mockResolvedValue([]);

      await loadFilteredAccommodationData({
        category: 'accom',
        latitude: 53.4808,
        longitude: -2.2426,
        radiusKm: 5
      });

      expect(mockFind).toHaveBeenCalledWith({
        $and: [
          {
            'GeneralInfo.ServiceProviderId': {
              $exists: true,
              $nin: [null, ''],
              $type: 'string'
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
          },
          {
            'Address.Location': {
              $geoWithin: {
                $centerSphere: [[-2.2426, 53.4808], 5 / 6371]
              }
            }
          }
        ]
      });
    });

    it('should combine all filters when provided', async () => {
      mockToArray.mockResolvedValue([]);

      await loadFilteredAccommodationData({
        category: 'accom',
        location: 'Manchester',
        subcategory: 'emergency',
        latitude: 53.4808,
        longitude: -2.2426,
        radiusKm: 10
      });

      expect(mockFind).toHaveBeenCalledWith({
        $and: [
          {
            'GeneralInfo.ServiceProviderId': {
              $exists: true,
              $nin: [null, ''],
              $type: 'string'
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
          },
          {
            'Address.City': { $regex: /^Manchester/i }
          },
          {
            'GeneralInfo.AccommodationType': { $regex: /^emergency/i }
          },
          {
            'Address.Location': {
              $geoWithin: {
                $centerSphere: [[-2.2426, 53.4808], 10 / 6371]
              }
            }
          }
        ]
      });
    });

    it('should transform document data correctly', async () => {
      mockToArray.mockResolvedValue([mockAccommodationDocument]);

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      const expectedAccommodation: AccommodationData = {
        id: '507f1f77bcf86cd799439011',
        name: 'Test Accommodation',
        synopsis: 'Test synopsis',
        description: 'Test description',
        serviceProviderId: 'test-provider-123',
        address: {
          street1: '123 Test Street',
          street2: 'Test Area',
          street3: '',
          city: 'Manchester',
          postcode: 'M1 1AA',
          latitude: 53.4808,
          longitude: -2.2426,
          associatedCityId: 'manchester'
        },
        contact: {
          name: 'John Doe',
          telephone: '0161 123 4567',
          email: 'john@example.com',
          additionalInfo: 'Call between 9-5'
        },
        accommodation: {
          type: 'supported',
          isOpenAccess: true,
          referralRequired: false,
          referralNotes: 'No referral needed',
          price: '50',
          foodIncluded: 1,
          availabilityOfMeals: 'Breakfast and dinner'
        },
        features: {
          acceptsHousingBenefit: 1,
          acceptsPets: 2, // Default value when AcceptsPets is 0
          acceptsCouples: 1,
          hasDisabledAccess: 1,
          isSuitableForWomen: 1,
          isSuitableForYoungPeople: 2, // Default value when IsSuitableForYoungPeople is 0
          hasSingleRooms: 1,
          hasSharedRooms: 2, // Default value when HasSharedRooms is 0
          hasShowerBathroomFacilities: 1,
          hasAccessToKitchen: 1,
          hasLaundryFacilities: 1,
          hasLounge: 1,
          allowsVisitors: 1,
          hasOnSiteManager: 1,
          additionalFeatures: 'WiFi available'
        },
        residentCriteria: {
          acceptsMen: false,
          acceptsWomen: true,
          acceptsCouples: true,
          acceptsYoungPeople: false,
          acceptsFamilies: false,
          acceptsBenefitsClaimants: true
        },
        support: {
          hasOnSiteManager: 1,
          supportOffered: ['mental health', 'substance abuse'],
          supportInfo: 'We provide comprehensive support'
        }
      };

      expect(result[0]).toEqual(expectedAccommodation);
    });

    it('should handle documents with missing optional fields', async () => {
      const minimalDocument = {
        _id: '507f1f77bcf86cd799439012',
        GeneralInfo: {
          ServiceProviderId: 'test-provider-456'
        },
        Address: {},
        ContactInformation: {},
        PricingAndRequirementsInfo: {},
        FeaturesWithDiscretionary: {},
        ResidentCriteriaInfo: {},
        SupportProvidedInfo: {}
      };

      mockToArray.mockResolvedValue([minimalDocument]);

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: '507f1f77bcf86cd799439012',
        name: '',
        synopsis: '',
        description: '',
        serviceProviderId: 'test-provider-456',
        address: {
          street1: '',
          street2: '',
          street3: '',
          city: '',
          postcode: '',
          latitude: 0,
          longitude: 0,
          associatedCityId: ''
        },
        accommodation: {
          type: 'other',
          isOpenAccess: false,
          referralRequired: false,
          referralNotes: '',
          price: '0',
          foodIncluded: 2,
          availabilityOfMeals: ''
        }
      });
    });

    it('should handle database connection errors', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockToArray.mockRejectedValue(new Error('Database connection failed'));

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Error loading filtered accommodation data:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should handle null coordinates correctly', async () => {
      const documentWithNullCoords = {
        ...mockAccommodationDocument,
        Address: {
          ...mockAccommodationDocument.Address,
          Location: null
        }
      };

      mockToArray.mockResolvedValue([documentWithNullCoords]);

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      expect(result[0].address.latitude).toBe(0);
      expect(result[0].address.longitude).toBe(0);
    });

    it('should handle undefined coordinates correctly', async () => {
      const documentWithUndefinedCoords = {
        ...mockAccommodationDocument,
        Address: {
          ...mockAccommodationDocument.Address,
          Location: {
            type: 'Point',
            coordinates: undefined
          }
        }
      };

      mockToArray.mockResolvedValue([documentWithUndefinedCoords]);

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      expect(result[0].address.latitude).toBe(0);
      expect(result[0].address.longitude).toBe(0);
    });
  });

  describe('loadAccommodationDataForProvider', () => {
    const mockProviderDocument = {
      _id: '507f1f77bcf86cd799439013',
      GeneralInfo: {
        Name: 'Provider Accommodation',
        ServiceProviderId: 'provider-123',
        IsPubliclyVisible: true
      },
      Address: {
        City: 'Birmingham'
      },
      ContactInformation: {},
      PricingAndRequirementsInfo: {},
      FeaturesWithDiscretionary: {},
      ResidentCriteriaInfo: {},
      SupportProvidedInfo: {}
    };

    it('should fetch accommodation data for specific provider', async () => {
      mockToArray.mockResolvedValue([mockProviderDocument]);

      const result = await loadAccommodationDataForProvider('provider-123');

      expect(mockCollection).toHaveBeenCalledWith('TemporaryAccommodation');
      expect(mockFind).toHaveBeenCalledWith({
        'GeneralInfo.ServiceProviderId': 'provider-123',
        $or: [
          { 'GeneralInfo.IsPubliclyVisible': true },
          { 'GeneralInfo.IsPublished': true },
          {
            'GeneralInfo.IsPublished': { $exists: false },
            'GeneralInfo.IsPubliclyVisible': { $ne: false }
          }
        ]
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Provider Accommodation');
      expect(result[0].serviceProviderId).toBe('provider-123');
    });

    it('should return empty array when no accommodations found for provider', async () => {
      mockToArray.mockResolvedValue([]);

      const result = await loadAccommodationDataForProvider('nonexistent-provider');

      expect(result).toEqual([]);
    });

    it('should handle database errors for provider query', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockToArray.mockRejectedValue(new Error('Provider query failed'));

      const result = await loadAccommodationDataForProvider('provider-123');

      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '❌ Error loading accommodation data for provider provider-123:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('should transform provider accommodation data correctly', async () => {
      const completeProviderDocument = {
        _id: '507f1f77bcf86cd799439014',
        GeneralInfo: {
          Name: 'Complete Provider Accommodation',
          Synopsis: 'Great place to stay',
          Description: 'Full description here',
          AccommodationType: 'emergency',
          ServiceProviderId: 'provider-456',
          IsOpenAccess: false,
          IsPublished: true
        },
        Address: {
          Street1: '456 Provider Street',
          City: 'Liverpool',
          Postcode: 'L1 1AA',
          Location: {
            coordinates: [-2.9916, 53.4084]
          }
        },
        ContactInformation: {
          Name: 'Jane Smith',
          Email: 'jane@provider.com'
        },
        PricingAndRequirementsInfo: {
          ReferralIsRequired: true,
          Price: '75'
        },
        FeaturesWithDiscretionary: {
          AcceptsHousingBenefit: 1,
          HasDisabledAccess: 1
        },
        ResidentCriteriaInfo: {
          AcceptsMen: true,
          AcceptsWomen: false
        },
        SupportProvidedInfo: {
          SupportOffered: ['housing advice'],
          SupportInfo: 'Housing support available'
        }
      };

      mockToArray.mockResolvedValue([completeProviderDocument]);

      const result = await loadAccommodationDataForProvider('provider-456');

      expect(result[0]).toMatchObject({
        id: '507f1f77bcf86cd799439014',
        name: 'Complete Provider Accommodation',
        synopsis: 'Great place to stay',
        description: 'Full description here',
        serviceProviderId: 'provider-456',
        address: {
          street1: '456 Provider Street',
          city: 'Liverpool',
          postcode: 'L1 1AA',
          latitude: 53.4084,
          longitude: -2.9916
        },
        contact: {
          name: 'Jane Smith',
          email: 'jane@provider.com'
        },
        accommodation: {
          type: 'emergency',
          isOpenAccess: false,
          referralRequired: true,
          price: '75'
        },
        features: {
          acceptsHousingBenefit: 1,
          hasDisabledAccess: 1
        },
        residentCriteria: {
          acceptsMen: true,
          acceptsWomen: false
        },
        support: {
          supportOffered: ['housing advice'],
          supportInfo: 'Housing support available'
        }
      });
    });

    it('should handle various provider ID formats', async () => {
      mockToArray.mockResolvedValue([]);

      // Test with different ID formats
      await loadAccommodationDataForProvider('provider-with-dashes');
      await loadAccommodationDataForProvider('provider_with_underscores');
      await loadAccommodationDataForProvider('ProviderWithCamelCase');
      await loadAccommodationDataForProvider('123-numeric-provider');

      expect(mockFind).toHaveBeenCalledTimes(4);
      expect(mockFind).toHaveBeenNthCalledWith(1, expect.objectContaining({
        'GeneralInfo.ServiceProviderId': 'provider-with-dashes'
      }));
      expect(mockFind).toHaveBeenNthCalledWith(2, expect.objectContaining({
        'GeneralInfo.ServiceProviderId': 'provider_with_underscores'
      }));
      expect(mockFind).toHaveBeenNthCalledWith(3, expect.objectContaining({
        'GeneralInfo.ServiceProviderId': 'ProviderWithCamelCase'
      }));
      expect(mockFind).toHaveBeenNthCalledWith(4, expect.objectContaining({
        'GeneralInfo.ServiceProviderId': '123-numeric-provider'
      }));
    });
  });

  describe('Data Transformation Edge Cases', () => {
    it('should handle completely empty documents', async () => {
      const emptyDocument = {
        _id: '507f1f77bcf86cd799439015'
      };

      mockToArray.mockResolvedValue([emptyDocument]);

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      expect(result[0]).toMatchObject({
        id: '507f1f77bcf86cd799439015',
        name: '',
        synopsis: '',
        description: '',
        serviceProviderId: '',
        accommodation: {
          type: 'other',
          isOpenAccess: false,
          referralRequired: false,
          referralNotes: '',
          price: '0',
          foodIncluded: 2,
          availabilityOfMeals: ''
        }
      });
    });

    it('should handle documents with null GeneralInfo', async () => {
      const nullGeneralInfoDocument = {
        _id: '507f1f77bcf86cd799439016',
        GeneralInfo: null
      };

      mockToArray.mockResolvedValue([nullGeneralInfoDocument]);

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      expect(result[0].serviceProviderId).toBe('');
      expect(result[0].accommodation.type).toBe('other');
    });

    it('should handle array fields correctly', async () => {
      const documentWithArrays = {
        _id: '507f1f77bcf86cd799439017',
        GeneralInfo: {
          ServiceProviderId: 'test-arrays'
        },
        SupportProvidedInfo: {
          SupportOffered: ['mental health', 'housing', 'employment'],
          SupportInfo: 'Multiple services available'
        }
      };

      mockToArray.mockResolvedValue([documentWithArrays]);

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      expect(result[0].support.supportOffered).toEqual(['mental health', 'housing', 'employment']);
      expect(result[0].support.supportInfo).toBe('Multiple services available');
    });

    it('should handle boolean fields with various falsy values', async () => {
      const documentWithFalsyBooleans = {
        _id: '507f1f77bcf86cd799439018',
        GeneralInfo: {
          ServiceProviderId: 'test-booleans',
          IsOpenAccess: null,
          IsPubliclyVisible: undefined
        },
        ResidentCriteriaInfo: {
          AcceptsMen: false,
          AcceptsWomen: 0,
          AcceptsCouples: '',
          AcceptsYoungPeople: null
        }
      };

      mockToArray.mockResolvedValue([documentWithFalsyBooleans]);

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      expect(result[0].accommodation.isOpenAccess).toBe(false);
      expect(result[0].residentCriteria.acceptsMen).toBe(false);
      expect(result[0].residentCriteria.acceptsWomen).toBe(false);
      expect(result[0].residentCriteria.acceptsCouples).toBe(false);
      expect(result[0].residentCriteria.acceptsYoungPeople).toBe(false);
    });

    it('should handle numeric fields with string values', async () => {
      const documentWithStringNumbers = {
        _id: '507f1f77bcf86cd799439019',
        GeneralInfo: {
          ServiceProviderId: 'test-numbers'
        },
        PricingAndRequirementsInfo: {
          FoodIsIncluded: '1', // String instead of number
          Price: 'Free' // Non-numeric string
        },
        FeaturesWithDiscretionary: {
          AcceptsHousingBenefit: '0',
          HasDisabledAccess: 'yes' // Non-numeric string
        }
      };

      mockToArray.mockResolvedValue([documentWithStringNumbers]);

      const result = await loadFilteredAccommodationData({
        category: 'accom'
      });

      expect(result[0].accommodation.foodIncluded).toBe('1');
      expect(result[0].accommodation.price).toBe('Free');
      expect(result[0].features.acceptsHousingBenefit).toBe('0');
      expect(result[0].features.hasDisabledAccess).toBe('yes');
    });
  });
});