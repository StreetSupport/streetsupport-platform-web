/**
 * @jest-environment node
 */

import { GET } from '@/app/api/service-provider-addresses/route';
import '../../setup/mongoMemory';


// ✅ Mock Mongo client for addresses
jest.mock('@/utils/mongodb', () => ({
  getClientPromise: async () => {
    return {
      db: () => ({
        collection: (name: string) => {
          if (name === 'ServiceProviderAddresses') {
            return {
              find: () => ({
                project: () => ({
                  toArray: async () => [
                    {
                      Key: 'address-1',
                      ServiceProviderKey: 'org-1',
                      Line1: '123 Test Street',
                      Line2: '',
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

          throw new Error('Unknown collection');
        },
      }),
    };
  },
}));

describe('GET /api/service-provider-addresses', () => {
  it('returns success and addresses array', async () => {
    const req = new Request('http://localhost/api/service-provider-addresses');
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.status).toBe('success');
    expect(Array.isArray(json.results)).toBe(true);
    expect(typeof json.total).toBe('number');
    expect(json.results[0].City).toBe('Leeds');
  });
});
