/**
 * @jest-environment node
 */

import { GET } from '@/app/api/services/route';

// Mock MongoDB to simulate both working and failing states
jest.mock('@/utils/mongodb', () => ({
  getClientPromise: jest.fn(),
}));

import * as mongodb from '@/utils/mongodb';
const mockGetClientPromise = mongodb.getClientPromise as jest.Mock;

// Mock the query cache
jest.mock('@/utils/queryCache', () => ({
  get: jest.fn().mockReturnValue(null), // Always cache miss for tests
  set: jest.fn(),
  generateKey: jest.fn().mockReturnValue('test-cache-key'),
}));

describe('GET /api/services - Error Handling and Geospatial Tests', () => {

  describe('Input validation', () => {
    it('validates latitude and longitude parameters', async () => {
      const req = new Request('http://localhost/api/services?lat=invalid&lng=-1.5491');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toContain('Invalid latitude or longitude values');
    });

    it('requires both lat and lng for geospatial queries', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toContain('Both lat and lng parameters are required');
    });

    it('validates latitude range', async () => {
      const req = new Request('http://localhost/api/services?lat=91&lng=-1.5491');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toContain('Latitude must be between -90 and 90');
    });

    it('validates longitude range', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=181');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toContain('longitude must be between -180 and 180');
    });

    it('validates radius parameter', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=invalid');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toContain('Invalid radius value');
    });

    it('validates negative radius', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=-5');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toContain('Invalid radius value');
    });

    it('validates page parameter', async () => {
      const req = new Request('http://localhost/api/services?page=0');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toContain('Invalid page or limit value');
    });

    it('validates limit parameter', async () => {
      const req = new Request('http://localhost/api/services?limit=0');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(400);
      expect(json.status).toBe('error');
      expect(json.message).toContain('Invalid page or limit value');
    });
  });

  describe('Database failure handling', () => {
    beforeEach(() => {
      // Mock database to always fail
      mockGetClientPromise.mockRejectedValue(new Error('Database connection failed'));
    });

    it('returns 503 when database fails for geospatial queries', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=15');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(503);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Service temporarily unavailable. Please try again later.');
    });

    it('returns 503 when database fails for basic queries', async () => {
      const req = new Request('http://localhost/api/services?page=1&limit=5');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(503);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Service temporarily unavailable. Please try again later.');
    });

    it('returns 503 with consistent error structure', async () => {
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=25&page=1&limit=1');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(503);
      expect(json.status).toBe('error');
      expect(json.message).toBe('Service temporarily unavailable. Please try again later.');
      expect(json).not.toHaveProperty('results');
      expect(json).not.toHaveProperty('total');
    });
  });

  describe('Error resilience', () => {
    it('provides consistent response structure for validation errors', async () => {
      const req = new Request('http://localhost/api/services?lat=invalid&lng=-1.5491');
      const res = await GET(req);
      const json = await res.json();
      
      expect(json).toHaveProperty('status');
      expect(json).toHaveProperty('message');
      expect(json.status).toBe('error');
    });

    it('handles edge case coordinates when database is available', async () => {
      // Mock successful database connection
      const mockClient = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            aggregate: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue([])
            })
          })
        })
      };
      mockGetClientPromise.mockResolvedValue(mockClient);
      
      const req = new Request('http://localhost/api/services?lat=-89.9&lng=179.9&radius=10');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);
    });

    it('handles very large radius values when database is available', async () => {
      // Mock successful database connection
      const mockClient = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            aggregate: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue([])
            })
          })
        })
      };
      mockGetClientPromise.mockResolvedValue(mockClient);
      
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=20000');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);
    });

    it('handles very small radius values when database is available', async () => {
      // Mock successful database connection
      const mockClient = {
        db: jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            aggregate: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue([])
            })
          })
        })
      };
      mockGetClientPromise.mockResolvedValue(mockClient);
      
      const req = new Request('http://localhost/api/services?lat=53.8008&lng=-1.5491&radius=0.001');
      const res = await GET(req);
      const json = await res.json();
      
      expect(res.status).toBe(200);
      expect(json.status).toBe('success');
      expect(Array.isArray(json.results)).toBe(true);
    });
  });
});