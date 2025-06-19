import { render, screen } from '@testing-library/react';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';

describe('OrganisationContactBlock', () => {
  it('shows no contact items if none are provided', () => {
    const organisation = {
      name: 'Org A',
      email: '',
      telephone: '',
      website: '',
      facebook: '',
      twitter: '',
      groupedServices: {}, // required by prop type
    };

    render(<OrganisationContactBlock organisation={organisation} />);

    // Heading always visible
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Contact Details');

    // Should have no rendered contact items
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(0);
  });
});
