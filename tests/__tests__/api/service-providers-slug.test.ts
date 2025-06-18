/**
 * @jest-environment node
 */

import { GET } from '@/app/api/service-providers/[slug]/route';

// ✅ Mock Mongo client for slug route (provider + addresses + services)
jest.mock('@/utils/mongodb', () => ({
  getClientPromise: async () => {
    return {
      db: () => ({
        collection: (name: string) => {
          if (name === 'ServiceProviders') {
            return {
              findOne: async (query: any) => {
                if (query.Key?.$regex?.source === '^not-found$') {
                  return null; // simulate not found
                }
                return {
                  Key: 'org-1',
                  Name: 'Test Org',
                  ShortDescription: 'Test org description',
                  LongDescription: 'Long description here',
                  Website: 'https://test.org',
                  Telephone: '123456',
                  Email: 'info@test.org',
                  IsVerified: true,
                  IsPublished: true,
                  AssociatedLocationIds: ['leeds'],
                  Tags: [],
                  SocialLinks: [],
                };
              },
            };
          }

          if (name === 'ServiceProviderAddresses') {
            return {
              find: () => ({
                project: () => ({
                  toArray: async () => [
                    {
                      Key: 'address-1',
                      ServiceProviderKey: 'org-1',
                      Line1: '123 Test Street',
                      City: 'Leeds',
                      Postcode: 'LS1 1AA',
                      Latitude: 53.8008,
                      Longitude: -1.5491,
                    },
                  ],
                }),
              }),
            };
          }

          if (name === 'ProvidedServices') {
            return {
              find: () => ({
                project: () => ({
                  toArray: async () => [
                    {
                      Key: 'service-1',
                      Title: 'Test Service',
                      ParentCategoryKey: 'health',
                      SubCategoryKey: 'gp',
                      Description: 'Service description',
                      OpeningTimes: [],
                      ClientGroups: [],
                      Address: { City: 'Leeds' },
                    },
                  ],
                }),
              }),
            };
          }

          throw new Error('Unknown collection');
        },
      }),
    };
  },
}));

describe('GET /api/service-providers/[slug]', () => {
  it('returns success with org, addresses and services', async () => {
    const req = new Request('http://localhost/api/service-providers/org-1');
    // Use Next.js dynamic param shape
    const res = await GET(req, { params: { slug: 'org-1' } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(json.organisation.Name).toBe('Test Org');
    expect(Array.isArray(json.addresses)).toBe(true);
    expect(Array.isArray(json.services)).toBe(true);
  });

  it('returns 404 if org not found', async () => {
    const req = new Request('http://localhost/api/service-providers/not-found');
    const res = await GET(req, { params: { slug: 'not-found' } });
    expect(res.status).toBe(404);
  });
});
