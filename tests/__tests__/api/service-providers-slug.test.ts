/**
 * @jest-environment node
 */

import { GET } from '@/app/api/service-providers/[slug]/route';
import * as mongodb from '@/utils/mongodb';
import { mockServices, mockAddresses } from '../../__mocks__/api-responses';
import { NextRequest } from 'next/server';

// Mock the mongodb utility
jest.mock('@/utils/mongodb', () => ({
  getClientPromise: jest.fn(),
}));

describe('GET /api/service-providers/[slug]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return organisation details when found', async () => {
    // Arrange
    const mockProvidersCollection = {
      findOne: jest.fn().mockResolvedValue({
        _id: 'test-org-id',
        Key: 'test-org',
        Name: 'Test Organisation',
        ShortDescription: 'A test organisation for testing purposes',
        Description: 'This is a longer description of the test organisation',
        Website: 'https://example.org',
        Telephone: '0123 456 7890',
        Email: 'contact@example.org',
        Facebook: 'testorg',
        Twitter: 'testorg',
        Instagram: 'testorg',
        Bluesky: '@testorg.bsky.social',
        IsVerified: true,
        IsPublished: true,
        AssociatedLocationIds: ['birmingham', 'manchester'],
        Tags: ['health', 'housing', 'food'],
        Addresses: mockAddresses
      }),
    };

    const mockServicesCollection = {
      find: jest.fn().mockReturnValue({
        project: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue(mockServices),
        }),
      }),
    };

    const mockDb = {
      collection: jest.fn((name) => {
        if (name === 'ServiceProviders') return mockProvidersCollection;
        if (name === 'ProvidedServices') return mockServicesCollection;
        return null;
      }),
    };

    const mockClient = {
      db: jest.fn().mockReturnValue(mockDb),
    };

    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/service-providers/test-org')
    );

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data.status).toBe('success');
    expect(data.organisation).toBeDefined();
    expect(data.organisation.name).toBe('Test Organisation');
    expect(data.addresses).toHaveLength(mockAddresses.length);
    expect(data.services).toHaveLength(mockServices.length);
    expect(mockDb.collection).toHaveBeenCalledWith('ServiceProviders');
    expect(mockDb.collection).toHaveBeenCalledWith('ProvidedServices');
    expect(mockProvidersCollection.findOne).toHaveBeenCalledWith(
      { Key: { $regex: new RegExp(`^test-org$`, 'i') } },
      expect.any(Object)
    );
  });

  it('should return 404 when organisation is not found', async () => {
    // Arrange
    const mockProvidersCollection = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    const mockDb = {
      collection: jest.fn((name) => {
        if (name === 'ServiceProviders') return mockProvidersCollection;
        return null;
      }),
    };

    const mockClient = {
      db: jest.fn().mockReturnValue(mockDb),
    };

    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/service-providers/non-existent')
    );

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(404);
    expect(data.status).toBe('error');
    expect(data.message).toBe('Organisation not found');
    expect(mockDb.collection).toHaveBeenCalledWith('ServiceProviders');
    expect(mockProvidersCollection.findOne).toHaveBeenCalledWith(
      { Key: { $regex: new RegExp(`^non-existent$`, 'i') } },
      expect.any(Object)
    );
  });

  it('should return 500 when database error occurs', async () => {
    // Arrange
    const mockProvidersCollection = {
      findOne: jest.fn().mockRejectedValue(new Error('Database error')),
    };

    const mockDb = {
      collection: jest.fn((name) => {
        if (name === 'ServiceProviders') return mockProvidersCollection;
        return null;
      }),
    };

    const mockClient = {
      db: jest.fn().mockReturnValue(mockDb),
    };

    (mongodb.getClientPromise as jest.Mock).mockResolvedValue(mockClient);

    const request = new NextRequest(
      new URL('http://localhost:3000/api/service-providers/test-org')
    );

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(500);
    expect(data.status).toBe('error');
    expect(data.message).toBe('Failed to fetch organisation details');
    expect(mockDb.collection).toHaveBeenCalledWith('ServiceProviders');
    expect(mockProvidersCollection.findOne).toHaveBeenCalledWith(
      { Key: { $regex: new RegExp(`^test-org$`, 'i') } },
      expect.any(Object)
    );
  });

  it('should return 400 when slug is missing', async () => {
    // Arrange
    // Create a URL that will result in an empty slug when parsed
    const request = new NextRequest(
      new URL('http://localhost:3000/api/service-providers/')
    );

    // Act
    const response = await GET(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data.status).toBe('error');
    expect(data.message).toBe('Slug is required');
  });
});