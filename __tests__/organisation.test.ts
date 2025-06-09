import { getOrganisationBySlug } from '@/utils/organisation';

jest.mock('@/data/service-providers.json', () => [
  {
    id: '1',
    name: 'Test Org',
    slug: 'test-org',
    latitude: 53,
    longitude: -2,
    services: [
      { id: 's1', name: 'A', category: 'cat1', subCategory: 'sub', description: '' },
      { id: 's2', name: 'B', category: 'cat2', subCategory: 'sub', description: '' },
    ],
  },
]);

describe('getOrganisationBySlug', () => {
  it('returns organisation details with grouped services', () => {
    const result = getOrganisationBySlug('test-org');
    expect(result?.name).toBe('Test Org');
    expect(result?.groupedServices.cat1).toHaveLength(1);
    expect(result?.groupedServices.cat2).toHaveLength(1);
  });

  it('returns null for unknown slug', () => {
    expect(getOrganisationBySlug('unknown')).toBeNull();
  });
});
