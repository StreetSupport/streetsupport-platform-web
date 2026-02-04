/**
 * Mock Factory Functions
 *
 * Centralised factory functions that produce type-safe mock objects for testing.
 * These ensure all mocks match the actual type definitions used in production code.
 */

import type { FlattenedService, SwepData } from '@/types';
import type { Address, OrganisationDetails } from '@/utils/organisation';
import type { LocationContextType, LocationState, LocationError } from '@/contexts/LocationContext';

/**
 * Creates a mock GeoJSON Point location
 */
export function createMockLocation(
  lng: number,
  lat: number
): { type: 'Point'; coordinates: [number, number] } {
  return {
    type: 'Point',
    coordinates: [lng, lat] as [number, number],
  };
}

/**
 * Creates a mock opening time entry
 * @param day - Day of week (0 = Sunday, 6 = Saturday)
 * @param start - Start time in minutes from midnight (e.g., 540 = 9:00)
 * @param end - End time in minutes from midnight (e.g., 1020 = 17:00)
 */
export function createMockOpeningTime(
  day: number,
  start: number,
  end: number
): { day: number; start: number; end: number } {
  return { day, start, end };
}

/**
 * Creates a mock address
 */
export function createMockAddress(overrides?: Partial<Address>): Address {
  return {
    Street: '123 Test Street',
    City: 'Manchester',
    Postcode: 'M1 1AA',
    Location: createMockLocation(-2.2426, 53.4808),
    ...overrides,
  };
}

/**
 * Creates a mock flattened service
 */
export function createMockService(
  overrides?: Partial<FlattenedService>
): FlattenedService {
  return {
    id: 'service-1',
    name: 'Test Service',
    category: 'food',
    subCategory: 'foodbank',
    organisation: 'Test Organisation',
    organisationSlug: 'test-organisation',
    description: 'A test service description',
    address: createMockAddress(),
    openTimes: [
      createMockOpeningTime(1, 540, 1020), // Monday 9:00-17:00
      createMockOpeningTime(2, 540, 1020), // Tuesday 9:00-17:00
    ],
    clientGroups: [],
    latitude: 53.4808,
    longitude: -2.2426,
    ...overrides,
  };
}

/**
 * Creates a mock organisation
 */
export function createMockOrganisation(
  overrides?: Partial<OrganisationDetails>
): OrganisationDetails {
  const services = overrides?.services ?? [createMockService()];

  return {
    key: 'test-organisation',
    name: 'Test Organisation',
    shortDescription: 'A test organisation',
    description: 'A test organisation providing various services',
    addresses: [createMockAddress()],
    services,
    groupedServices: groupServicesByCategoryAndSubcategory(services),
    isVerified: true,
    isPublished: true,
    ...overrides,
  };
}

/**
 * Groups services by category and subcategory (matches production logic)
 */
function groupServicesByCategoryAndSubcategory(
  services: FlattenedService[]
): Record<string, Record<string, FlattenedService[]>> {
  return services.reduce(
    (acc, service) => {
      const category = service.category || 'uncategorised';
      const subCategory = service.subCategory || 'general';

      if (!acc[category]) {
        acc[category] = {};
      }
      if (!acc[category][subCategory]) {
        acc[category][subCategory] = [];
      }
      acc[category][subCategory].push(service);

      return acc;
    },
    {} as Record<string, Record<string, FlattenedService[]>>
  );
}

/**
 * Creates mock SWEP (Severe Weather Emergency Protocol) data
 */
export function createMockSwepData(overrides?: Partial<SwepData>): SwepData {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return {
    id: 'swep-1',
    locationSlug: 'manchester',
    title: 'SWEP Active',
    body: 'Severe weather emergency protocol is now active.',
    shortMessage: 'SWEP is active',
    swepActiveFrom: now.toISOString(),
    swepActiveUntil: tomorrow.toISOString(),
    isActive: true,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    createdBy: 'admin',
    emergencyContact: {
      phone: '0800 123 456',
      email: 'emergency@example.com',
      hours: '24/7',
    },
    ...overrides,
  };
}

/**
 * Creates a mock LocationContext value
 */
export function createMockLocationContext(
  overrides?: Partial<LocationContextType>
): LocationContextType {
  return {
    location: null,
    setLocation: jest.fn(),
    setLocationFromCoordinates: jest.fn(),
    updateRadius: jest.fn(),
    requestLocation: jest.fn().mockResolvedValue(undefined),
    clearLocation: jest.fn(),
    error: null,
    isLoading: false,
    clearError: jest.fn(),
    ...overrides,
  };
}

/**
 * Creates a mock location state
 */
export function createMockLocationState(
  overrides?: Partial<LocationState>
): LocationState {
  return {
    lat: 53.4808,
    lng: -2.2426,
    source: 'geolocation',
    radius: 5,
    ...overrides,
  };
}

/**
 * Creates a mock location error
 */
export function createMockLocationError(
  overrides?: Partial<LocationError>
): LocationError {
  return {
    code: 'PERMISSION_DENIED',
    message: 'Location access denied.',
    ...overrides,
  };
}
