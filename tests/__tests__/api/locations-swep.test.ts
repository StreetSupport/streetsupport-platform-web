/**
 * @jest-environment node
 */

import { GET } from '@/app/api/locations/[slug]/swep/route';
import { NextRequest } from 'next/server';
import { ObjectId } from 'mongodb';

// Mock MongoDB
const mockFindOne = jest.fn();

jest.mock('@/utils/mongodb', () => ({
  getClientPromise: jest.fn(() =>
    Promise.resolve({
      db: () => ({
        collection: () => ({
          findOne: mockFindOne,
        }),
      }),
    })
  ),
}));

describe('/api/locations/[slug]/swep', () => {
  const mockSwepDocument = {
    _id: new ObjectId(),
    LocationSlug: 'manchester',
    Title: 'Severe Weather Emergency Protocol - Manchester',
    Body: '<p>Emergency accommodation available</p>',
    Image: '/assets/img/swep-manchester.jpg',
    ShortMessage: 'Emergency accommodation and services are available due to severe weather conditions.',
    SwepActiveFrom: new Date('2024-01-15T18:00:00Z'),
    SwepActiveUntil: new Date('2024-01-18T09:00:00Z'),
    IsActive: true,
    CreatedBy: 'admin',
    DocumentCreationDate: new Date('2024-01-15T12:00:00Z'),
    DocumentModifiedDate: new Date('2024-01-15T12:00:00Z'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET requests', () => {
    it('returns SWEP data for valid location with active SWEP', async () => {
      mockFindOne.mockResolvedValueOnce({ ...mockSwepDocument, IsActive: true });

      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('success');
      expect(data.data.swep).toBeDefined();
      expect(data.data.swep.locationSlug).toBe('manchester');
      expect(data.data.swep.title).toBe('Severe Weather Emergency Protocol - Manchester');
      expect(data.data.swep.isActive).toBe(true);
      expect(data.data.isActive).toBe(true);
      expect(data.data.location).toBe('manchester');
    });

    it('returns null SWEP data for location without SWEP', async () => {
      mockFindOne.mockResolvedValueOnce(null);

      const request = new NextRequest('http://localhost:3000/api/locations/leeds/swep');
      const params = Promise.resolve({ slug: 'leeds' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('success');
      expect(data.data.swep).toBeNull();
      expect(data.data.isActive).toBe(false);
      expect(data.data.location).toBe('leeds');
    });

    it('returns 400 error when slug is missing', async () => {
      const request = new NextRequest('http://localhost:3000/api/locations//swep');
      const params = Promise.resolve({ slug: '' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.status).toBe('error');
      expect(data.message).toBe('Location slug is required');
    });

    it('includes no-cache headers for fresh data', async () => {
      mockFindOne.mockResolvedValueOnce(mockSwepDocument);

      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });

      const response = await GET(request, { params });

      expect(response.headers.get('Cache-Control')).toBe('no-store, no-cache, must-revalidate, max-age=0');
    });

    it('handles SWEP data that is not currently active', async () => {
      mockFindOne.mockResolvedValueOnce({ ...mockSwepDocument, IsActive: false });

      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('success');
      expect(data.data.swep).toBeDefined();
      expect(data.data.swep.isActive).toBe(false);
      expect(data.data.isActive).toBe(false);
    });

    it('returns SWEP data with image when provided', async () => {
      mockFindOne.mockResolvedValueOnce(mockSwepDocument);

      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(data.data.swep.image).toBe('/assets/img/swep-manchester.jpg');
    });

    it('handles database errors gracefully', async () => {
      mockFindOne.mockRejectedValueOnce(new Error('DB connection failed'));

      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.status).toBe('error');
      expect(data.message).toBe('Unable to fetch SWEP data at this time');
    });

    it('includes emergency contact when provided', async () => {
      mockFindOne.mockResolvedValueOnce({
        ...mockSwepDocument,
        EmergencyContact: {
          Phone: '0800 123 456',
          Email: 'emergency@example.com',
          Hours: '24/7',
        },
      });

      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });

      const response = await GET(request, { params });
      const data = await response.json();

      expect(data.data.swep.emergencyContact).toEqual({
        phone: '0800 123 456',
        email: 'emergency@example.com',
        hours: '24/7',
      });
    });
  });
});
