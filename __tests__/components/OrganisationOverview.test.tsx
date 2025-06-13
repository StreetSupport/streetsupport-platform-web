import { render, screen } from '@testing-library/react';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';

const organisation: any = {
  id: '1',
  name: 'Helpful Org',
  slug: 'helpful',
  postcode: '',
  latitude: 53.1,
  longitude: -2.1,
  verified: true,
  published: true,
  disabled: false,
  services: [
    { id: 's1', name: 'A', category: 'training', subCategory: 'skill', description: '', openTimes: [], clientGroups: [], latitude: 0, longitude: 0 },
    { id: 's2', name: 'B', category: 'employment', subCategory: 'jobs', description: '', openTimes: [], clientGroups: [], latitude: 0, longitude: 0 },
    { id: 's3', name: 'C', category: 'training', subCategory: 'skill', description: '', openTimes: [], clientGroups: [], latitude: 0, longitude: 0 },
  ],
};

describe('OrganisationOverview', () => {
  it('renders organisation name and unique category tags', () => {
    render(<OrganisationOverview organisation={organisation} />);
    expect(screen.getByText('Helpful Org')).toBeInTheDocument();
    expect(screen.getByText('training')).toBeInTheDocument();
    expect(screen.getByText('employment')).toBeInTheDocument();
    expect(screen.getAllByText('training')).toHaveLength(1);
  });
});
