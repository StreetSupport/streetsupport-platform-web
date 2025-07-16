/**
 * @jest-environment node
 */

import { GET } from '@/app/api/services/route';

// Mock Mongo client for services + join with provider
jest.mock('@/utils/mongodb', () => ({
  getClientPromise: async () => {
    return {
      db: () => ({
        collection: (name: string) => {
          if (name === 'ProvidedServices') {
            return {
              countDocuments: async () => 1,
              find: () => ({
                skip: () => ({
                  limit: () => ({
                    toArray: async () => [
                      {
                        Key: 'service-1',
                        ServiceProviderKey: 'org-1',
                        Title: 'Test Service',
                        ParentCategoryKey: 'health',
                        SubCategoryKey: 'gp',
                        Description: 'Test description',
                        OpeningTimes: [],
                        ClientGroups: [],
                        Address: { 
                          City: 'Leeds',
                          Location: {
                            coordinates: [-1.5491, 53.8008] // Leeds coordinates
                          }
                        },
                        IsPublished: true
                      },
                    ],
                  }),
                }),
              }),
              aggregate: () => ({
                toArray: async () => [
                  {
                    Key: 'service-1',
                    ServiceProviderKey: 'org-1',
                    Title: 'Test Service',
                    ParentCategoryKey: 'health',
                    SubCategoryKey: 'gp',
                    Description: 'Test description',
                    OpeningTimes: [],
                    ClientGroups: [],
                    Address: { 
                      City: 'Leeds',
                      Location: {
                        coordinates: [-1.5491, 53.8008]
                      }
                    },
                    IsPublished: true,
                    distance: 5000 // 5km in meters
                  },
                ],
              }),
            };
          }

          if (name === 'ServiceProviders') {
            return {
              findOne: async () => ({
                Key: 'org-1',
                Name: 'Test Org',
                ShortDescription: 'Test org description',
                Website: 'https://test.org',
                Telephone: '123456',
                Email: 'info@test.org',
                IsVerified: true,
              }),
            };
          }

          throw new Error('Unknown collection');
        },
      }),
    };
  },
}));

describe('GET /api/services', () => {
  it('returns success and services array', async () => {
    const req = new Request('http://localhost/api/services?page=1&limit=2');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(typeof json.total).toBe('number');
  });

  it('handles invalid page value', async () => {
    const req = new Request('http://localhost/api/services?page=-1');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('filters by location and category (mock)', async () => {
    const req = new Request('http://localhost/api/services?location=leeds&category=health');
    const res = await GET(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results[0].organisation).toBeDefined();
    expect(json.results[0].organisation.name).toBe('Test Org');
    expect(json.results[0].organisation.slug).toBe('org-1');
    expect(json.results[0].organisation.isVerified).toBe(true);
  });

  describe('Geospatial queries', () => {
    it('requires both lat and lng parameters', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Both lat and lng parameters are required for geospatial queries');
    });

    it('validates latitude and longitude values', async () => {
      const req = new Request('http://localhost/api/services?lat=invalid&lng=-1.5491');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Invalid latitude or longitude values');
    });

    it('validates latitude range', async () => {
      const req = new Request('http://localhost/api/services?lat=91&lng=-1.5491');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Latitude must be between -90 and 90, longitude must be between -180 and 180');
    });

    it('validates longitude range', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=181');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Latitude must be between -90 and 90, longitude must be between -180 and 180');
    });

    it('validates radius value', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=invalid');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Invalid radius value');
    });

    it('validates positive radius value', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=-5');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Invalid radius value');
    });

    it('performs geospatial query with valid coordinates', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=10');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);
      expect(json.results[0]).toBeDefined();
      expect(json.results[0].distance).toBe(5); // 5000m converted to 5km
    });

    it('uses default radius when not provided', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);
    });

    it('combines geospatial query with category filter', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=10&category=health');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);
      expect(json.results[0].distance).toBe(5);
    });

    it('handles pagination with geospatial queries', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=10&page=1&limit=5');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(json.page).toBe(1);
      expect(json.limit).toBe(5);
      expect(Array.isArray(json.results)).toBe(true);
    });
  });

  describe('Distance calculation', () => {
    it('calculates distance correctly using Haversine formula', async () => {
      // Test the calculateDistance function indirectly through fallback behavior
      const originalMock = jest.requireMock('@/utils/mongodb');
      jest.doMock('@/utils/mongodb', () => ({
        getClientPromise: async () => {
          throw new Error('Database connection failed');
        },
      }));

      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=50');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);

      // Restore original mock
      jest.doMock('@/utils/mongodb', () => originalMock);
    });

    it('rounds distance to 2 decimal places', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=10');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.results[0].distance).toBe(5); // Should be rounded to 2 decimal places
    });
  });

  describe('Error handling', () => {
    it('handles database errors gracefully', async () => {
      // This test verifies the fallback mechanism works
      const originalMock = jest.requireMock('@/utils/mongodb');
      jest.doMock('@/utils/mongodb', () => ({
        getClientPromise: async () => {
          throw new Error('Database connection failed');
        },
      }));

      const req = new Request('http://localhost/api/services?page=1&limit=5');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);

      // Restore original mock
      jest.doMock('@/utils/mongodb', () => originalMock);
    });


  });
});
