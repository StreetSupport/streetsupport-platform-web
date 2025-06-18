/**
 * @jest-environment node
 */

import { GET } from '@/app/api/service-providers/route';

jest.mock('@/utils/mongodb', () => ({
  getClientPromise: async () => {
    return {
      db: () => ({
        collection: () => ({
          countDocuments: async () => 1,
          find: () => ({
            skip: () => ({
              limit: () => ({
                project: () => ({
                  toArray: async () => [
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
                  ],
                }),
              }),
            }),
          }),
        }),
      }),
    };
  },
}));


describe('GET /api/service-providers', () => {
  it('returns success and results array', async () => {
    const req = new Request('http://localhost/api/service-providers?page=1&limit=2');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(typeof json.total).toBe('number');
    expect(typeof json.page).toBe('number');
    expect(typeof json.limit).toBe('number');
  });

  it('handles invalid page value', async () => {
    const req = new Request('http://localhost/api/service-providers?page=-1');
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it('filters by location (if any match)', async () => {
    const req = new Request('http://localhost/api/service-providers?location=leeds');
    const res = await GET(req);
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
  });
});
