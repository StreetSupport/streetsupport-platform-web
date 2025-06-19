import { getOrganisationBySlug } from '@/utils/organisation';

describe('getOrganisationBySlug', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns organisation with grouped services when found', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        organisation: { // ✅ MUST WRAP in `organisation` to match real API
          id: '1',
          name: 'Mock Org',
          slug: 'mock-org',
          groupedServices: {
            training: {
              skill: [
                {
                  id: 'a',
                  name: 'Service A',
                  organisation: 'Mock Org',
                  organisationSlug: 'mock-org',
                },
              ],
            },
            Other: {
              misc: [
                {
                  id: 'b',
                  name: 'Service B',
                  organisation: 'Mock Org',
                  organisationSlug: 'mock-org',
                },
              ],
            },
          },
        },
      }),
    });

    const org = await getOrganisationBySlug('mock-org');
    expect(org?.name).toBe('Mock Org');

    expect(org?.groupedServices.training).toBeDefined();
    expect(org?.groupedServices.training.skill).toHaveLength(1);

    expect(org?.groupedServices.Other).toBeDefined();
    expect(org?.groupedServices.Other.misc).toHaveLength(1);

    expect(org?.groupedServices.training.skill[0]).toMatchObject({
      organisation: 'Mock Org',
      organisationSlug: 'mock-org',
    });
  });

  it('returns null for unknown slug', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const org = await getOrganisationBySlug('unknown');
    expect(org).toBeNull();
  });
});
