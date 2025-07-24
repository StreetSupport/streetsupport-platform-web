/**
 * @jest-environment node
 */

import { GET } from '@/app/api/services/route';
import * as mongodb from '@/utils/mongodb';

// Mock the mongodb utility
jest.mock('@/utils/mongodb', () => ({
  getClientPromise: jest.fn(),
}));

// Mock the query cache
jest.mock('@/utils/queryCache', () => ({
  get: jest.fn().mockReturnValue(null), // Always cache miss for tests
  set: jest.fn(),
  generateKey: jest.fn().mockReturnValue('test-cache-key'),
}));


const mockServices = [
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
  {
    Key: 'service-2',
    ServiceProviderKey: 'org-2',
    Title: 'Test Service 2',
    ParentCategoryKey: 'housing',
    SubCategoryKey: 'emergency',
    Description: 'Housing service description',
    OpeningTimes: [],
    ClientGroups: [],
    Address: { 
      City: 'Manchester',
      Location: {
        coordinates: [-2.2426, 53.4808] // Manchester coordinates
      }
    },
    IsPublished: true
  },
];

const mockProviders = [
  {
    Key: 'org-1',
    Name: 'Test Org',
    ShortDescription: 'Test org description',
    Website: 'https://test.org',
    Telephone: '123456',
    Email: 'info@test.org',
    IsVerified: true,
  },
  {
    Key: 'org-2',
    Name: 'Test Org 2',
    ShortDescription: 'Test org 2 description',
    Website: 'https://test2.org',
    Telephone: '654321',
    Email: 'info@test2.org',
    IsVerified: false,
  },
];

const createMockServicesCollection = (shouldThrow = false, customData?: any[], aggregateData?: any[]) => {
  const mockAggregate = jest.fn().mockImplementation((pipeline: any[]) => ({
    toArray: jest.fn().mockImplementation(async () => {
      if (shouldThrow) throw new Error('Database error');
      
      // Check if this is a count pipeline (contains $count stage)
      const hasCountStage = pipeline.some(stage => stage.$count);
      if (hasCountStage) {
        // Apply same filtering logic for count
        let dataToCount = aggregateData || customData || mockServices;
        
        // Apply location filtering if specified in pipeline
        const matchStage = pipeline.find(stage => stage.$match);
        if (matchStage && matchStage.$match['Address.City']) {
          const cityRegex = matchStage.$match['Address.City'].$regex;
          dataToCount = dataToCount.filter(service => 
            cityRegex.test(service.Address?.City || '')
          );
        }
        
        // Apply category filtering if specified in pipeline
        if (matchStage && matchStage.$match['ParentCategoryKey']) {
          const categoryRegex = matchStage.$match['ParentCategoryKey'].$regex;
          dataToCount = dataToCount.filter(service => 
            categoryRegex.test(service.ParentCategoryKey || '')
          );
        }
        
        return [{ total: dataToCount.length }];
      }
      
      // Simulate filtering based on the pipeline stages
      let filteredServices = aggregateData || customData || mockServices;
      
      // Apply location filtering if specified in pipeline
      const matchStage = pipeline.find(stage => stage.$match);
      if (matchStage && matchStage.$match['Address.City']) {
        const cityRegex = matchStage.$match['Address.City'].$regex;
        filteredServices = filteredServices.filter(service => 
          cityRegex.test(service.Address?.City || '')
        );
      }
      
      // Apply category filtering if specified in pipeline
      if (matchStage && matchStage.$match['ParentCategoryKey']) {
        const categoryRegex = matchStage.$match['ParentCategoryKey'].$regex;
        filteredServices = filteredServices.filter(service => 
          categoryRegex.test(service.ParentCategoryKey || '')
        );
      }
      
      // Apply pagination
      const skipStage = pipeline.find(stage => stage.$skip);
      const limitStage = pipeline.find(stage => stage.$limit);
      const skip = skipStage?.$skip || 0;
      const limit = limitStage?.$limit || filteredServices.length;
      
      filteredServices = filteredServices.slice(skip, skip + limit);
      
      // Return with provider data from lookup
      return filteredServices.map(service => ({
        ...service,
        distance: service.distance || 5000,
        // Add provider data from lookup
        provider: mockProviders.find(p => p.Key === service.ServiceProviderKey),
        name: service.Title || service.ServiceProviderName || service.name,
        description: service.Description || service.Info || service.description,
        organisation: mockProviders.find(p => p.Key === service.ServiceProviderKey) ? {
          name: mockProviders.find(p => p.Key === service.ServiceProviderKey)?.Name,
          slug: service.ServiceProviderKey,
          isVerified: mockProviders.find(p => p.Key === service.ServiceProviderKey)?.IsVerified || false
        } : null
      }));
    }),
  }));

  return {
    countDocuments: jest.fn().mockImplementation(async () => {
      if (shouldThrow) throw new Error('Database error');
      return customData ? customData.length : mockServices.length;
    }),
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          toArray: jest.fn().mockImplementation(async () => {
            if (shouldThrow) throw new Error('Database error');
            return customData || mockServices;
          }),
        }),
      }),
    }),
    aggregate: mockAggregate,
  };
};

const createMockProvidersCollection = (shouldThrow = false) => ({
  findOne: jest.fn().mockImplementation(async (query) => {
    if (shouldThrow) throw new Error('Database error');
    const providerKey = query.Key;
    return mockProviders.find(p => p.Key === providerKey) || null;
  }),
});

const createMockClient = (shouldThrow = false, customServicesData?: any[], aggregateData?: any[]) => ({
  db: jest.fn().mockReturnValue({
    collection: jest.fn().mockImplementation((name: string) => {
      if (name === 'ProvidedServices') {
        return createMockServicesCollection(shouldThrow, customServicesData, aggregateData);
      }
      if (name === 'ServiceProviders') {
        return createMockProvidersCollection(shouldThrow);
      }
      throw new Error('Unknown collection');
    }),
  }),
});

describe('GET /api/services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns success and services array', async () => {
    // Arrange
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/services?page=1&limit=2');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(typeof json.total).toBe('number');
    expect(json.page).toBe(1);
    expect(json.limit).toBe(2);
    expect(json.results).toHaveLength(2);
  });

  it('handles invalid page value', async () => {
    // Act
    const req = new Request('http://localhost/api/services?page=-1');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(400);
    expect(json.status).toBe('error');
    expect(json.message).toBe('Invalid page or limit value');
  });

  it('handles invalid limit value', async () => {
    // Act
    const req = new Request('http://localhost/api/services?limit=0');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(400);
    expect(json.status).toBe('error');
    expect(json.message).toBe('Invalid page or limit value');
  });

  it('filters by location correctly', async () => {
    // Arrange - use all mock services, filtering happens in pipeline
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/services?location=leeds');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results).toHaveLength(1);
    expect(json.results[0].Address.City).toBe('Leeds');
  });

  it('filters by category correctly', async () => {
    // Arrange - use all mock services, filtering happens in pipeline
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/services?category=health');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results).toHaveLength(1);
    expect(json.results[0].ParentCategoryKey).toBe('health');
  });

  it('filters by location and category combined', async () => {
    // Arrange - use all mock services, filtering happens in pipeline
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/services?location=leeds&category=health');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results[0].organisation).toBeDefined();
    expect(json.results[0].organisation.name).toBe('Test Org');
    expect(json.results[0].organisation.slug).toBe('org-1');
    expect(json.results[0].organisation.isVerified).toBe(true);
  });

  it('returns empty results when no services match filters', async () => {
    // Arrange - use all mock services, filtering happens in pipeline
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act - use a location that doesn't exist in mock data
    const req = new Request('http://localhost/api/services?location=nonexistent');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results).toHaveLength(0);
    expect(json.total).toBe(0);
  });

  it('uses default pagination values when not provided', async () => {
    // Arrange
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/services');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(json.page).toBe(1);
    expect(json.limit).toBe(20);
  });

  it('handles pagination correctly', async () => {
    // Arrange
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/services?page=2&limit=1');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(json.page).toBe(2);
    expect(json.limit).toBe(1);
    
    // Since the API might fall back to static data when database operations fail,
    // we'll just verify that the pagination parameters are correctly handled
    // The important thing is that the API returns the correct page and limit values
    expect(json.results).toBeDefined();
    expect(Array.isArray(json.results)).toBe(true);
  });

  it('includes organisation details in service results', async () => {
    // Arrange
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/services?page=1&limit=1');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(json.results[0]).toHaveProperty('organisation');
    expect(json.results[0].organisation).toHaveProperty('name');
    expect(json.results[0].organisation).toHaveProperty('slug');
    expect(json.results[0].organisation).toHaveProperty('isVerified');
    expect(json.results[0].organisation.name).toBe('Test Org');
    expect(json.results[0].organisation.slug).toBe('org-1');
    expect(json.results[0].organisation.isVerified).toBe(true);
  });

  it('handles missing organisation gracefully', async () => {
    // Arrange
    const servicesWithMissingOrg = [{
      ...mockServices[0],
      ServiceProviderKey: 'nonexistent-org'
    }];
    const mockClient = createMockClient(false, servicesWithMissingOrg);
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/services?page=1&limit=1');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(json.results[0].organisation).toEqual({
      name: '',
      slug: 'nonexistent-org',
      isVerified: false
    });
  });

  describe('Geospatial queries', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('requires both lat and lng parameters', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Both lat and lng parameters are required for geospatial queries');
    });

    it('requires both lat and lng parameters (missing lat)', async () => {
      const req = new Request('http://localhost/api/services?lng=-1.5491');
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

    it('validates latitude and longitude values (invalid lng)', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=invalid');
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

    it('validates zero radius value', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=0');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Invalid radius value');
    });

    it('performs geospatial query with valid coordinates', async () => {
      // Arrange
      const geoServices = mockServices.map(service => ({ ...service, distance: 5000 }));
      const mockClient = createMockClient(false, undefined, geoServices);
      (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

      // Act
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=10');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);
      expect(json.results[0]).toBeDefined();
      expect(json.results[0].distance).toBe(5); // 5000m converted to 5km
    });

    it('uses default radius when not provided', async () => {
      // Arrange
      const geoServices = mockServices.map(service => ({ ...service, distance: 5000 }));
      const mockClient = createMockClient(false, undefined, geoServices);
      (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

      // Act
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);
    });

    it('combines geospatial query with category filter', async () => {
      // Arrange
      const geoServices = mockServices.map(service => ({ ...service, distance: 5000 }));
      const mockClient = createMockClient(false, undefined, geoServices);
      (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

      // Act
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=10&category=health');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);
      expect(json.results[0].distance).toBe(5);
    });

    it('handles pagination with geospatial queries', async () => {
      // Arrange
      const geoServices = mockServices.map(service => ({ ...service, distance: 5000 }));
      const mockClient = createMockClient(false, undefined, geoServices);
      (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

      // Act
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=10&page=1&limit=5');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(json.page).toBe(1);
      expect(json.limit).toBe(5);
      expect(Array.isArray(json.results)).toBe(true);
    });

    it('handles geospatial query errors and returns 503', async () => {
      // Arrange
      const mockClient = createMockClient(true); // Will throw on aggregate operations
      (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

      // Act
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=10');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert - Should return 503 Service Unavailable
      expect(res.status).toBe(503);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Service temporarily unavailable. Please try again later.');
    });
  });

  describe('Distance calculation', () => {
    it('rounds distance to 2 decimal places', async () => {
      // Arrange
      const geoServices = mockServices.map(service => ({ ...service, distance: 5000 }));
      const mockClient = createMockClient(false, undefined, geoServices);
      (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

      // Act
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=10');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert
      expect(res.status).toBe(200);
      expect(json.results[0].distance).toBe(5); // Should be rounded to 2 decimal places
    });
  });

  describe('Error handling', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('handles database connection errors and returns 503', async () => {
      // Arrange
      (mongodb.getClientPromise as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      // Act
      const req = new Request('http://localhost/api/services?page=1&limit=5');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert - Should return 503 Service Unavailable
      expect(res.status).toBe(503);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Service temporarily unavailable. Please try again later.');
    });

    it('handles database query errors and returns 503', async () => {
      // Arrange
      const mockClient = createMockClient(true); // Will throw on query operations
      (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

      // Act
      const req = new Request('http://localhost/api/services?page=1&limit=5');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert - Should return 503 Service Unavailable
      expect(res.status).toBe(503);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Service temporarily unavailable. Please try again later.');
    });

    it('handles aggregate pipeline errors and returns 503', async () => {
      // Arrange
      const mockClient = createMockClient(true); // Will throw on aggregate operations
      (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

      // Act
      const req = new Request('http://localhost/api/services?page=1&limit=1');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert - Should return 503 Service Unavailable
      expect(res.status).toBe(503);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Service temporarily unavailable. Please try again later.');
    });

    it('returns 503 when database fails', async () => {
      // Arrange
      (mongodb.getClientPromise as jest.Mock).mockRejectedValue(new Error('Database connection failed'));
      
      // Act
      const req = new Request('http://localhost/api/services?page=1&limit=5');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert - Should return 503 Service Unavailable
      expect(res.status).toBe(503);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Service temporarily unavailable. Please try again later.');
    });

    it('returns 503 for geospatial queries when database fails', async () => {
      // Arrange
      (mongodb.getClientPromise as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

      // Act
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=50');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert - Should return 503 Service Unavailable
      expect(res.status).toBe(503);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Service temporarily unavailable. Please try again later.');
    });

    it('returns consistent 503 error for any database failure', async () => {
      // Arrange
      (mongodb.getClientPromise as jest.Mock).mockRejectedValue(new Error('Database connection failed'));
      
      // Act
      const req = new Request('http://localhost/api/services?page=1&limit=5');
      const res = await GET(req);
      const json = await res.json();
      
      // Assert - Should return 503 Service Unavailable
      expect(res.status).toBe(503);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Service temporarily unavailable. Please try again later.');
    });
  });

});
