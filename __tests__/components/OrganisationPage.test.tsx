import { render, screen } from '@testing-library/react';
import OrganisationPage from '@/app/find-help/organisation/[slug]/page';
import type { OrganisationDetails } from '@/utils/organisation';
jest.mock("@/components/MapComponent/GoogleMap", () => () => <div />);

const mockOrg: OrganisationDetails = {
  id: '1',
  name: 'Org',
  slug: 'org',
  postcode: '',
  latitude: 53,
  longitude: -1,
  verified: true,
  published: true,
  disabled: false,
  services: [],
  groupedServices: {},
};

jest.mock('@/utils/organisation', () => ({
  getOrganisationBySlug: jest.fn(() => mockOrg),
}));

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

describe('OrganisationPage', () => {
  it('renders organisation details when found', async () => {
    const Page = await OrganisationPage({ params: { slug: 'org' } });
    render(Page);
    expect(screen.getByText('Org')).toBeInTheDocument();
  });

  it('calls notFound when organisation is missing', async () => {
    const utils = await import('@/utils/organisation');
    (utils.getOrganisationBySlug as jest.Mock).mockReturnValueOnce(null);
    const nav = await import('next/navigation');
    await OrganisationPage({ params: { slug: 'missing' } });
    expect((nav.notFound as jest.Mock)).toHaveBeenCalled();
  });
});
