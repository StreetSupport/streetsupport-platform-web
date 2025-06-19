import { render, screen } from '@testing-library/react';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';

describe('OrganisationContactBlock', () => {
  it('shows no contact items if none are provided', () => {
    const organisation = {
      Name: 'Org A',
      Email: '',
      Telephone: '',
      Website: '',
      Facebook: '',
      Twitter: '',
    };

    render(<OrganisationContactBlock organisation={organisation} />);

    // Heading always visible
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Contact Details');

    // List should be empty
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(0);
  });
});
