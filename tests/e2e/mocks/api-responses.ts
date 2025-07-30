// Mock API responses for E2E tests when MongoDB is not available
import type { ServiceWithDistance } from '@/types';

// Test location coordinates (Manchester)
export const TEST_COORDINATES = {
  lat: 53.4808,
  lng: -2.2426,
  postcode: 'M1 1AA'
};

// Mock service data
export const mockServices: ServiceWithDistance[] = [
  {
    id: 'test-service-1',
    name: 'Manchester Food Bank',
    description: 'Emergency food provision for people in crisis',
    category: 'meals',
    subCategory: 'food-bank',
    latitude: 53.4820,
    longitude: -2.2430,
    organisation: {
      name: 'Test Food Bank Organisation',
      slug: 'test-food-bank-org',
      isVerified: true
    },
    organisationSlug: 'test-food-bank-org',
    clientGroups: ['everyone'],
    openTimes: [
      { day: 1, start: 900, end: 1700 },
      { day: 2, start: 900, end: 1700 },
      { day: 3, start: 900, end: 1700 }
    ],
    distance: 0.12
  },
  {
    id: 'test-service-2',
    name: 'Homeless Shelter Service',
    description: 'Temporary accommodation for rough sleepers',
    category: 'accommodation',
    subCategory: 'emergency-accommodation',
    latitude: 53.4795,
    longitude: -2.2445,
    organisation: {
      name: 'Test Shelter Organisation',
      slug: 'test-shelter-org',
      isVerified: false
    },
    organisationSlug: 'test-shelter-org',
    clientGroups: ['homeless'],
    openTimes: [
      { day: 1, start: 1800, end: 800 },
      { day: 2, start: 1800, end: 800 }
    ],
    distance: 0.25
  },
  {
    id: 'test-service-3',
    name: 'Mental Health Support Group',
    description: 'Weekly support group for mental health issues',
    category: 'health',
    subCategory: 'mental-health',
    latitude: 53.4785,
    longitude: -2.2400,
    organisation: {
      name: 'Test Mental Health Organisation',
      slug: 'test-mental-health-org',
      isVerified: true
    },
    organisationSlug: 'test-mental-health-org',
    clientGroups: ['everyone'],
    openTimes: [
      { day: 3, start: 1800, end: 2000 }
    ],
    distance: 0.35
  }
];

// Mock service providers
export const mockServiceProviders = [
  {
    Key: 'test-food-bank-org',
    Name: 'Test Food Bank Organisation',
    ShortDescription: 'Providing emergency food to those in need',
    IsVerified: true,
    IsPublished: true,
    AssociatedLocationIds: ['manchester'],
    Website: 'https://example.com',
    Telephone: '0161 123 4567',
    Email: 'info@testfoodbank.org'
  },
  {
    Key: 'test-shelter-org',
    Name: 'Test Shelter Organisation',
    ShortDescription: 'Emergency accommodation services',
    IsVerified: false,
    IsPublished: true,
    AssociatedLocationIds: ['manchester'],
    Website: 'https://example-shelter.com',
    Telephone: '0161 765 4321',
    Email: 'help@testshelter.org'
  }
];

// Mock individual service provider with services
export const mockServiceProviderWithServices = {
  organisation: {
    Key: 'test-org',
    Name: 'Test Organisation',
    ShortDescription: 'A test organisation',
    IsVerified: true,
    IsPublished: true
  },
  services: mockServices.slice(0, 2)
};

// Mock statistics
export const mockStats = {
  organisations: 25,
  services: 150,
  partnerships: 8
};

// Mock location statistics
export const mockLocationStats = {
  organisationsCount: 12,
  servicesCount: 75,
  lastUpdated: new Date().toISOString()
};

// Mock FAQ data
export const mockFaqs = [
  {
    id: 'faq-1',
    question: 'How do I find services near me?',
    answer: 'Use the Find Help page to enter your postcode or share your location to discover nearby services.',
    category: 'general',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'Are all services free?',
    answer: 'Most services listed are free, but some may have nominal charges. Check individual service details.',
    category: 'general',
    order: 2
  }
];

// Mock geocoding response
export const mockGeocodeResponse = {
  location: TEST_COORDINATES,
  postcode: TEST_COORDINATES.postcode
};

// Mock search results
export const mockOrganisationSearchResults = {
  status: 'success',
  total: 2,
  page: 1,
  limit: 20,
  results: mockServiceProviders
};

// Helper function to generate realistic service responses
export function generateMockServicesResponse(params: URLSearchParams) {
  const lat = parseFloat(params.get('lat') || '0');
  const lng = parseFloat(params.get('lng') || '0');
  const radius = parseFloat(params.get('radius') || '5');
  const limit = parseInt(params.get('limit') || '20');

  // Filter services within radius (simplified calculation)
  let filteredServices = mockServices;
  
  if (lat && lng) {
    filteredServices = mockServices.filter(service => {
      const distance = Math.sqrt(
        Math.pow(service.latitude - lat, 2) + Math.pow(service.longitude - lng, 2)
      ) * 111; // Rough km conversion
      return distance <= radius;
    });
  }

  // Apply limit
  const results = filteredServices.slice(0, limit);

  return {
    status: 'success',
    total: results.length,
    page: 1,
    limit,
    results
  };
}

// Helper function for service provider responses
export function generateMockServiceProvidersResponse(params: URLSearchParams) {
  const location = params.get('location');
  const page = parseInt(params.get('page') || '1');
  const limit = parseInt(params.get('limit') || '20');

  let filteredProviders = mockServiceProviders;

  if (location) {
    filteredProviders = mockServiceProviders.filter(provider => 
      provider.AssociatedLocationIds.includes(location)
    );
  }

  const startIndex = (page - 1) * limit;
  const results = filteredProviders.slice(startIndex, startIndex + limit);

  return {
    status: 'success',
    total: filteredProviders.length,
    page,
    limit,
    results
  };
}