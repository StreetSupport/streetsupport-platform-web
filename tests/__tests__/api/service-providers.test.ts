/**
 * @jest-environment node
 */

import { GET } from '@/app/api/service-providers/route';
import * as mongodb from '@/utils/mongodb';

// Mock the mongodb utility
jest.mock('@/utils/mongodb', () => ({
  getClientPromise: jest.fn(),
}));

const mockServiceProviders = [
  {
    Key: 'test-org',
    Name: 'Test Organisation',
    ShortDescription: 'Test description',
    IsVerified: true,
    IsPublished: true,
    AssociatedLocationIds: ['leeds'],
    Website: 'https://test.org',
    Telephone: '123456789',
    Email: 'info@test.org',
  },
  {
    Key: 'test-org-2',
    Name: 'Test Organisation 2',
    ShortDescription: 'Another test description',
    IsVerified: false,
    IsPublished: true,
    AssociatedLocationIds: ['manchester'],
    Website: 'https://test2.org',
    Telephone: '987654321',
    Email: 'info@test2.org',
  },
];

const createMockCollection = (shouldThrow = false, customData?: any[]) => ({
  countDocuments: jest.fn().mockImplementation(async () => {
    if (shouldThrow) throw new Error('Database error');
    return customData ? customData.length : mockServiceProviders.length;
  }),
  find: jest.fn().mockReturnValue({
    skip: jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue({
        project: jest.fn().mockReturnValue({
          toArray: jest.fn().mockImplementation(async () => {
            if (shouldThrow) throw new Error('Database error');
            return customData || mockServiceProviders;
          }),
        }),
      }),
    }),
  }),
});

const createMockClient = (shouldThrow = false, customData?: any[]) => ({
  db: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue(createMockCollection(shouldThrow, customData)),
  }),
});


describe('GET /api/service-providers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns success and results array', async () => {
    // Arrange
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/service-providers?page=1&limit=2');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results).toHaveLength(2);
    expect(typeof json.total).toBe('number');
    expect(typeof json.page).toBe('number');
    expect(typeof json.limit).toBe('number');
    expect(json.page).toBe(1);
    expect(json.limit).toBe(2);
    expect(json.total).toBe(2);
  });

  it('handles invalid page value', async () => {
    // Act
    const req = new Request('http://localhost/api/service-providers?page=-1');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(400);
    expect(json.status).toBe('error');
    expect(json.message).toBe('Invalid page or limit value');
  });

  it('handles invalid limit value', async () => {
    // Act
    const req = new Request('http://localhost/api/service-providers?limit=0');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(400);
    expect(json.status).toBe('error');
    expect(json.message).toBe('Invalid page or limit value');
  });

  it('filters by location correctly', async () => {
    // Arrange
    const leedsProviders = [mockServiceProviders[0]]; // Only the Leeds provider
    const mockClient = createMockClient(false, leedsProviders);
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/service-providers?location=leeds');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results).toHaveLength(1);
    expect(json.results[0].AssociatedLocationIds).toContain('leeds');
  });

  it('returns empty results when no providers match location filter', async () => {
    // Arrange
    const mockClient = createMockClient(false, []);
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/service-providers?location=nonexistent');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(json.results).toHaveLength(0);
    expect(json.total).toBe(0);
  });

  it('handles database connection errors', async () => {
    // Arrange
    (mongodb.getClientPromise as jest.Mock).mockRejectedValue(new Error('Connection failed'));

    // Act
    const req = new Request('http://localhost/api/service-providers?page=1&limit=10');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(500);
    expect(json.status).toBe('error');
    expect(json.message).toBe('Failed to fetch service providers');
  });

  it('handles database query errors', async () => {
    // Arrange
    const mockClient = createMockClient(true); // Will throw on query operations
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/service-providers?page=1&limit=10');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(500);
    expect(json.status).toBe('error');
    expect(json.message).toBe('Failed to fetch service providers');
  });

  it('uses default pagination values when not provided', async () => {
    // Arrange
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/service-providers');
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
    const req = new Request('http://localhost/api/service-providers?page=2&limit=1');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(json.page).toBe(2);
    expect(json.limit).toBe(1);
    
    // Verify that skip was called with correct value (page-1) * limit = (2-1) * 1 = 1
    const mockCollection = mockClient.db().collection();
    expect(mockCollection.find().skip).toHaveBeenCalledWith(1);
    expect(mockCollection.find().skip().limit).toHaveBeenCalledWith(1);
  });

  it('returns correct data structure for service providers', async () => {
    // Arrange
    const mockClient = createMockClient();
    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    // Act
    const req = new Request('http://localhost/api/service-providers?page=1&limit=1');
    const res = await GET(req);
    const json = await res.json();

    // Assert
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(json.results[0]).toHaveProperty('Key');
    expect(json.results[0]).toHaveProperty('Name');
    expect(json.results[0]).toHaveProperty('ShortDescription');
    expect(json.results[0]).toHaveProperty('IsVerified');
    expect(json.results[0]).toHaveProperty('IsPublished');
    expect(json.results[0]).toHaveProperty('AssociatedLocationIds');
    expect(json.results[0]).toHaveProperty('Website');
    expect(json.results[0]).toHaveProperty('Telephone');
    expect(json.results[0]).toHaveProperty('Email');
    expect(json.results[0]).not.toHaveProperty('_id'); // Should be excluded
  });
});
