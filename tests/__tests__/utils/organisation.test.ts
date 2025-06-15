import { getOrganisationBySlug } from '@/utils/organisation';

jest.mock('@/data/service-providers.json', () => [
  {
    id: '1',
    name: 'Mock Org',
    slug: 'mock-org',
    postcode: '',
    latitude: 53,
    longitude: -2,
    verified: true,
    published: true,
    disabled: false,
    services: [
      {
        id: 'a',
        name: 'Service A',
        category: 'training',
        subCategory: 'skill',
        description: '',
        openTimes: [],
        clientGroups: [],
        latitude: 53,
        longitude: -2,
      },
      {
        id: 'b',
        name: 'Service B',
        category: undefined,
        subCategory: 'misc',
        description: '',
        openTimes: [],
        clientGroups: [],
        latitude: 53,
        longitude: -2,
      },
    ],
  },
]);

describe('getOrganisationBySlug', () => {
  it('returns organisation with grouped services when found', () => {
    const org = getOrganisationBySlug('mock-org');
    expect(org?.name).toBe('Mock Org');
    expect(org?.groupedServices.training).toHaveLength(1);
    expect(org?.groupedServices.Other).toHaveLength(1);
    expect(org?.groupedServices.training[0]).toMatchObject({
      organisation: 'Mock Org',
      organisationSlug: 'mock-org',
    });
  });

  it('returns null for unknown slug', () => {
    expect(getOrganisationBySlug('unknown')).toBeNull();
  });
});
