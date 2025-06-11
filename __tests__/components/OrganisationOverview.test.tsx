import { render, screen } from '@testing-library/react';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import type { OrganisationDetails } from '@/utils/organisation';

const mockOrganisation: OrganisationDetails = {
  id: '1',
  name: 'Test Org',
  slug: 'test-org',
  postcode: '',
  latitude: 53,
  longitude: -1,
  verified: true,
  published: true,
  disabled: false,
  services: [
    {
      id: 's1',
      name: 'Health Service',
      category: 'health',
      subCategory: 'gp',
      description: 'desc',
      openTimes: [],
      clientGroups: [],
      organisation: 'Test Org',
      organisationSlug: 'test-org',
      latitude: 53,
      longitude: -1,
    },
    {
      id: 's2',
      name: 'Training Service',
      category: 'training',
      subCategory: 'skills',
      description: 'desc',
      openTimes: [],
      clientGroups: [],
      organisation: 'Test Org',
      organisationSlug: 'test-org',
      latitude: 53,
      longitude: -1,
    },
  ],
  groupedServices: {
    health: [],
    training: [],
  },
};

describe('OrganisationOverview', () => {
  it('renders organisation name and categories', () => {
    render(<OrganisationOverview organisation={mockOrganisation} />);
    expect(screen.getByText('Test Org')).toBeInTheDocument();
    expect(screen.getByText('health')).toBeInTheDocument();
    expect(screen.getByText('training')).toBeInTheDocument();
  });
});
