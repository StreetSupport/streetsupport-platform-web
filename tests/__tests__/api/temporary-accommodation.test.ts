/**
 * @jest-environment node
 */

import { GET } from '@/app/api/temporary-accommodation/route';
import { NextRequest } from 'next/server';

// Mock the accommodation data loader
jest.mock('@/utils/accommodationData', () => ({
  loadFilteredAccommodationData: jest.fn(() => Promise.resolve([
    {
      id: '1',
      name: 'Test Accommodation',
      synopsis: 'Test synopsis',
      description: 'Test description',
      serviceProviderId: 'test-provider',
      address: {
        street1: 'Test Street 1',
        street2: 'Test Street 2',
        street3: '',
        city: 'Manchester',
        postcode: 'M1 1AA',
        latitude: 53.4808,
        longitude: -2.2426,
        associatedCityId: 'manchester'
      },
      contact: {
        name: 'Test Contact',
        telephone: '0161 123 4567',
        email: 'test@example.com',
        additionalInfo: ''
      },
      accommodation: {
        type: 'supported',
        isOpenAccess: false,
        referralRequired: true,
        referralNotes: 'Contact us first',
        price: '50',
        foodIncluded: 1,
        availabilityOfMeals: 'Breakfast and dinner'
      },
      features: {
        acceptsHousingBenefit: 1,
        acceptsPets: 0,
        acceptsCouples: 0,
        hasDisabledAccess: 1,
        isSuitableForWomen: 1,
        isSuitableForYoungPeople: 0,
        hasSingleRooms: 1,
        hasSharedRooms: 0,
        hasShowerBathroomFacilities: 1,
        hasAccessToKitchen: 1,
        hasLaundryFacilities: 1,
        hasLounge: 1,
        allowsVisitors: 1,
        hasOnSiteManager: 1,
        additionalFeatures: ''
      },
      residentCriteria: {
        acceptsMen: false,
        acceptsWomen: true,
        acceptsCouples: false,
        acceptsYoungPeople: false,
        acceptsFamilies: false,
        acceptsBenefitsClaimants: true
      },
      support: {
        hasOnSiteManager: 1,
        supportOffered: ['mental health', 'substance abuse'],
        supportInfo: 'We provide comprehensive support services'
      }
    }
  ]))
}));

describe('/api/temporary-accommodation', () => {
  it('should return temporary accommodation data with fallback', async () => {
    const request = new NextRequest('http://localhost:3000/api/temporary-accommodation');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.data).toHaveLength(1);
    expect(data.data[0]).toMatchObject({
      id: '1',
      name: 'Test Accommodation',
      synopsis: 'Test synopsis',
      address: {
        city: 'Manchester',
        postcode: 'M1 1AA'
      },
      accommodation: {
        type: 'supported'
      }
    });
  });

  it('should filter by location', async () => {
    const request = new NextRequest('http://localhost:3000/api/temporary-accommodation?location=Manchester');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.filters.location).toBe('Manchester');
  });

  it('should filter by accommodation type', async () => {
    const request = new NextRequest('http://localhost:3000/api/temporary-accommodation?type=supported');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.filters.accommodationType).toBe('supported');
  });

  it('should handle geospatial queries', async () => {
    const request = new NextRequest('http://localhost:3000/api/temporary-accommodation?lat=53.4808&lng=-2.2426&radius=5');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.filters.coordinates).toMatchObject({
      lat: 53.4808,
      lng: -2.2426,
      radius: 5
    });
  });

  it('should handle pagination', async () => {
    const request = new NextRequest('http://localhost:3000/api/temporary-accommodation?page=1&limit=10');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.pagination).toMatchObject({
      currentPage: 1,
      itemsPerPage: 10
    });
  });

  it('should return error for invalid coordinates', async () => {
    const request = new NextRequest('http://localhost:3000/api/temporary-accommodation?lat=invalid&lng=-2.2426');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.status).toBe('error');
    expect(data.message).toBe('Invalid latitude or longitude values');
  });

  it('should return error for missing lng parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/temporary-accommodation?lat=53.4808');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(400);
    expect(data.status).toBe('error');
    expect(data.message).toBe('Both lat and lng parameters are required for geospatial queries');
  });

  it('should include proper cache headers', async () => {
    const request = new NextRequest('http://localhost:3000/api/temporary-accommodation');
    
    const response = await GET(request);
    
    expect(response.headers.get('Cache-Control')).toContain('public');
    expect(response.headers.get('Vary')).toBe('Accept-Encoding');
  });
});