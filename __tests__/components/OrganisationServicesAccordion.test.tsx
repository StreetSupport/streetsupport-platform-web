import { render, screen } from '@testing-library/react';
import OrganisationServicesAccordion from '@/components/OrganisationPage/OrganisationServicesAccordion';
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
  groupedServices: {
    health: [
      {
        id: 's1',
        name: 'Health Service',
        category: 'health',
        subCategory: 'gp',
        description: 'desc',
        openTimes: [],
        clientGroups: [],
        organisation: 'Org',
        organisationSlug: 'org',
        latitude: 53,
        longitude: -1,
      },
    ],
  },
};

describe('OrganisationServicesAccordion', () => {
  it('renders category headings', () => {
    render(<OrganisationServicesAccordion organisation={org} />);
    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('health')).toBeInTheDocument();
  });

  it('returns null when no services', () => {
    const emptyOrg = { ...org, groupedServices: {} };
    const { container } = render(
      <OrganisationServicesAccordion organisation={emptyOrg} />
    );
    expect(container.firstChild).toBeNull();
  });
});
