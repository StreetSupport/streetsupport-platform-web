import { OrganisationDetails } from '@/utils/organisation';
import { FlattenedService, UIFlattenedService, ServiceWithDistance } from '@/types';

/**
 * Mock API Response Types
 * These types match the expected API response structures
 */
export interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  [key: string]: unknown;
}

export interface OrganisationApiResponse extends ApiResponse {
  organisation: OrganisationDetails;
  addresses: AddressType[];
  services: FlattenedService[];
}

export interface ErrorApiResponse extends ApiResponse {
  status: 'error';
  message: string;
  code?: string;
}

export interface AddressType {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

/**
 * Mock FlattenedService data
 * This represents a single service with all required fields
 */
export const mockFlattenedService: FlattenedService = {
  id: 'service-1',
  name: 'Mental Health Support',
  category: 'health',
  subCategory: 'mental-health',
  organisation: 'Test Organisation',
  organisationSlug: 'test-org',
  description: 'Providing mental health support services including counseling, therapy, and crisis intervention. Available for adults and young people.',
  openTimes: [
    { day: 1, start: 9, end: 17 }, // Monday 9am-5pm
    { day: 2, start: 9, end: 17 }, // Tuesday 9am-5pm
    { day: 3, start: 9, end: 17 }, // Wednesday 9am-5pm
    { day: 4, start: 9, end: 17 }, // Thursday 9am-5pm
    { day: 5, start: 9, end: 16 }, // Friday 9am-4pm
  ],
  clientGroups: ['adults', 'young-people'],
  latitude: 52.489471,
  longitude: -1.898575,
};

/**
 * Mock UIFlattenedService data
 * This represents a service with the nested organisation object structure
 * used by UI components
 */
export const mockUIFlattenedService: UIFlattenedService = {
  id: 'service-1',
  name: 'Mental Health Support',
  category: 'health',
  subCategory: 'mental-health',
  organisation: {
    name: 'Test Organisation',
    slug: 'test-org',
    isVerified: true,
    tags: ['health', 'mental-health'],
  },
  organisationSlug: 'test-org',
  description: 'Providing mental health support services including counseling, therapy, and crisis intervention. Available for adults and young people.',
  openTimes: [
    { day: 1, start: 9, end: 17 }, // Monday 9am-5pm
    { day: 2, start: 9, end: 17 }, // Tuesday 9am-5pm
    { day: 3, start: 9, end: 17 }, // Wednesday 9am-5pm
    { day: 4, start: 9, end: 17 }, // Thursday 9am-5pm
    { day: 5, start: 9, end: 16 }, // Friday 9am-4pm
  ],
  clientGroups: ['adults', 'young-people'],
  latitude: 52.489471,
  longitude: -1.898575,
};

/**
 * Mock ServiceWithDistance data
 * This represents a service with distance calculation from geospatial queries
 */
export const mockServiceWithDistance: ServiceWithDistance = {
  ...mockUIFlattenedService,
  distance: 1.5, // 1.5 kilometers
};

/**
 * Mock services array
 * A collection of different services for testing multiple service scenarios
 */
export const mockServices: FlattenedService[] = [
  mockFlattenedService,
  {
    ...mockFlattenedService,
    id: 'service-2',
    name: 'Housing Advice',
    category: 'housing',
    subCategory: 'advice',
    description: 'Providing housing advice and support including tenancy issues, homelessness prevention, and housing rights.',
  },
  {
    ...mockFlattenedService,
    id: 'service-3',
    name: 'Food Bank',
    category: 'food',
    subCategory: 'food-bank',
    description: 'Emergency food provision for individuals and families in crisis. Referral may be required.',
  },
];

/**
 * Mock 24/7 service for testing opening times hiding
 */
export const mock24_7Service: ServiceWithDistance = {
  id: 'service-24-7',
  name: '24/7 Crisis Hotline',
  category: 'support',
  subCategory: 'crisis',
  organisation: {
    name: '24/7 Crisis Support',
    slug: 'crisis-support-24-7',
    isVerified: true,
    tags: ['crisis', '24/7', 'emergency'],
  },
  organisationSlug: 'crisis-support-24-7',
  description: 'Round-the-clock crisis support hotline available 24 hours a day, 7 days a week.',
  openTimes: [
    { day: 0, start: 0, end: 2359 }, // Sunday 24 hours
    { day: 1, start: 0, end: 2359 }, // Monday 24 hours
    { day: 2, start: 0, end: 2359 }, // Tuesday 24 hours
    { day: 3, start: 0, end: 2359 }, // Wednesday 24 hours
    { day: 4, start: 0, end: 2359 }, // Thursday 24 hours
    { day: 5, start: 0, end: 2359 }, // Friday 24 hours
    { day: 6, start: 0, end: 2359 }, // Saturday 24 hours
  ],
  clientGroups: ['adults', 'young-people', 'families'],
  latitude: 52.489471,
  longitude: -1.898575,
  distance: 0.8,
};

/**
 * Mock UI services array
 * A collection of different services in UI format for testing UI components
 */
export const mockUIServices: UIFlattenedService[] = mockServices.map(service => ({
  ...service,
  organisation: {
    name: service.organisation,
    slug: service.organisationSlug,
    isVerified: true,
  },
}));

/**
 * Mock services with distance array
 * A collection of different services with distance calculations
 */
export const mockServicesWithDistance: ServiceWithDistance[] = mockUIServices.map((service, index) => ({
  ...service,
  distance: 0.5 * (index + 1), // 0.5, 1.0, 1.5 kilometers
}));

/**
 * Mock grouped services for OrganisationServicesAccordion
 * Services grouped by category and subcategory for accordion display
 */
export const mockGroupedServices: Record<string, Record<string, FlattenedService[]>> = {
  health: {
    'mental-health': [mockServices[0]],
  },
  housing: {
    advice: [mockServices[1]],
  },
  food: {
    'food-bank': [mockServices[2]],
  },
};

/**
 * Mock addresses
 * Sample addresses with full location data
 */
export const mockAddresses: AddressType[] = [
  {
    line1: '123 Test Street',
    line2: 'Test Area',
    city: 'Birmingham',
    postcode: 'B1 1AA',
    latitude: 52.489471,
    longitude: -1.898575,
  },
  {
    line1: '456 Another Road',
    city: 'Birmingham',
    postcode: 'B2 2BB',
    latitude: 52.479471,
    longitude: -1.888575,
  },
];

/**
 * Mock OrganisationDetails
 * Complete organisation details matching the OrganisationDetails interface
 */
export const mockOrganisationDetails: OrganisationDetails = {
  key: 'test-org',
  name: 'Test Organisation',
  shortDescription: 'A test organisation for testing purposes',
  description: 'This is a longer description of the test organisation that provides various services including mental health support, housing advice, and emergency food provision.',
  website: 'https://example.org',
  telephone: '0123 456 7890',
  email: 'contact@example.org',
  facebook: 'testorg',
  twitter: 'testorg',
  instagram: 'testorg',
  bluesky: '@testorg.bsky.social',
  isVerified: true,
  isPublished: true,
  associatedLocationIds: ['birmingham', 'manchester'],
  tags: ['health', 'housing', 'food'],
  addresses: mockAddresses,
  services: mockServices,
  groupedServices: mockGroupedServices,
};

/**
 * Mock minimal OrganisationDetails
 * Organisation with minimal required fields for testing edge cases
 */
export const mockMinimalOrganisationDetails: OrganisationDetails = {
  key: 'minimal-org',
  name: 'Minimal Organisation',
  addresses: [],
  services: [],
  groupedServices: {},
};

/**
 * Mock API response for getOrganisationBySlug
 * Complete API response structure for successful organisation retrieval
 */
export const mockOrganisationApiResponse: OrganisationApiResponse = {
  status: 'success',
  organisation: mockOrganisationDetails,
  addresses: mockAddresses,
  services: mockServices,
};

/**
 * Mock API response for minimal organisation
 * API response with minimal organisation data
 */
export const mockMinimalOrganisationApiResponse: OrganisationApiResponse = {
  status: 'success',
  organisation: mockMinimalOrganisationDetails,
  addresses: [],
  services: [],
};

/**
 * Mock error responses for different scenarios
 */
export const mockNotFoundResponse: ErrorApiResponse = {
  status: 'error',
  message: 'Organisation not found',
  code: 'NOT_FOUND',
};

export const mockServerErrorResponse: ErrorApiResponse = {
  status: 'error',
  message: 'Internal server error',
  code: 'SERVER_ERROR',
};

export const mockValidationErrorResponse: ErrorApiResponse = {
  status: 'error',
  message: 'Invalid slug format',
  code: 'VALIDATION_ERROR',
};

/**
 * Mock fetch implementations for different scenarios
 */

// Mock fetch implementation for successful response
export const mockFetchSuccess = () => {
  global.fetch = jest.fn().mockImplementation((_url) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockOrganisationApiResponse),
    })
  );
};

// Mock fetch implementation for minimal organisation response
export const mockFetchMinimalSuccess = () => {
  global.fetch = jest.fn().mockImplementation((_url) =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockMinimalOrganisationApiResponse),
    })
  );
};

// Mock fetch implementation for not found error
export const mockFetchNotFound = () => {
  global.fetch = jest.fn().mockImplementation((_url) =>
    Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve(mockNotFoundResponse),
    })
  );
};

// Mock fetch implementation for server error
export const mockFetchServerError = () => {
  global.fetch = jest.fn().mockImplementation((_url) =>
    Promise.resolve({
      ok: false,
      status: 500,
      json: () => Promise.resolve(mockServerErrorResponse),
    })
  );
};

// Mock fetch implementation for validation error
export const mockFetchValidationError = () => {
  global.fetch = jest.fn().mockImplementation((_url) =>
    Promise.resolve({
      ok: false,
      status: 400,
      json: () => Promise.resolve(mockValidationErrorResponse),
    })
  );
};

// Mock fetch implementation for network error
export const mockFetchNetworkError = () => {
  global.fetch = jest.fn().mockImplementation((_url) =>
    Promise.reject(new Error('Network error'))
  );
};

// Mock fetch implementation for timeout error
export const mockFetchTimeout = () => {
  global.fetch = jest.fn().mockImplementation((_url) =>
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 100);
    })
  );
};

// Reset fetch mock
export const resetFetchMock = () => {
  if (global.fetch && typeof jest.isMockFunction(global.fetch)) {
    (global.fetch as jest.Mock).mockClear();
  }
};