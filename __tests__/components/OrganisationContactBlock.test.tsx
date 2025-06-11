import { render, screen } from '@testing-library/react';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';
import type { OrganisationDetails } from '@/utils/organisation';

const org: OrganisationDetails = {
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

describe('OrganisationContactBlock', () => {
  it('renders contact text with organisation name', () => {
    render(<OrganisationContactBlock organisation={org} />);
    expect(
      screen.getByText(/We do not currently have public contact details for Org/i)
    ).toBeInTheDocument();
  });
});
