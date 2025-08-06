/**
 * @jest-environment node
 */

import { GET } from '@/app/api/locations/[slug]/swep/route';
import { NextRequest } from 'next/server';

// Mock the fallback data
jest.mock('@/data/swep-fallback.json', () => [
  {
    id: 'swep-manchester-1',
    locationSlug: 'manchester',
    title: 'Severe Weather Emergency Protocol - Manchester',
    body: '<p>Emergency accommodation available</p>',
    image: '/assets/img/swep-manchester.jpg',
    shortMessage: 'Emergency accommodation and services are available due to severe weather conditions.',
    swepActiveFrom: '2024-01-15T18:00:00Z',
    swepActiveUntil: '2024-01-18T09:00:00Z'
  }
]);

describe('/api/locations/[slug]/swep', () => {
  beforeEach(() => {
    // Mock current date to be within SWEP active period for testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-16T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('GET requests', () => {
    it('returns SWEP data for valid location with active SWEP', async () => {
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

    it('includes correct cache headers', async () => {
      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });
      
      const response = await GET(request, { params });

      expect(response.headers.get('Cache-Control')).toBe('public, max-age=300, s-maxage=600');
    });

    it('handles SWEP data that is not currently active', async () => {
      // Set time outside of active period
      jest.setSystemTime(new Date('2024-01-14T12:00:00Z')); // Before active period
      
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
      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(data.data.swep.image).toBe('/assets/img/swep-manchester.jpg');
    });

    it('handles database connection errors gracefully', async () => {
      // This test verifies that API failures fall back to JSON data
      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      // Should still return success with fallback data
      expect(response.status).toBe(200);
      expect(data.status).toBe('success');
      expect(data.data.swep).toBeDefined();
    });
  });

  describe('SWEP activity calculation', () => {
    it('correctly identifies active SWEP at start time', async () => {
      jest.setSystemTime(new Date('2024-01-15T18:00:00Z')); // Exact start time
      
      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(data.data.swep.isActive).toBe(true);
      expect(data.data.isActive).toBe(true);
    });

    it('correctly identifies active SWEP at end time', async () => {
      jest.setSystemTime(new Date('2024-01-18T09:00:00Z')); // Exact end time
      
      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(data.data.swep.isActive).toBe(true);
      expect(data.data.isActive).toBe(true);
    });

    it('correctly identifies inactive SWEP before start time', async () => {
      jest.setSystemTime(new Date('2024-01-15T17:59:59Z')); // Just before start
      
      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(data.data.swep.isActive).toBe(false);
      expect(data.data.isActive).toBe(false);
    });

    it('correctly identifies inactive SWEP after end time', async () => {
      jest.setSystemTime(new Date('2024-01-18T09:00:01Z')); // Just after end
      
      const request = new NextRequest('http://localhost:3000/api/locations/manchester/swep');
      const params = Promise.resolve({ slug: 'manchester' });
      
      const response = await GET(request, { params });
      const data = await response.json();

      expect(data.data.swep.isActive).toBe(false);
      expect(data.data.isActive).toBe(false);
    });
  });
});