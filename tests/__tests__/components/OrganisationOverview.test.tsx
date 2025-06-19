import { render, screen } from '@testing-library/react';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';

describe('OrganisationOverview', () => {
  it('renders organisation name only', () => {
    const organisation = {
      name: 'Helpful Org',
    };

    render(<OrganisationOverview organisation={organisation} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Helpful Org');
  });

  it('renders with short description', () => {
    const organisation = {
      name: 'Helpful Org',
      shortDescription: 'We help people.',
    };

    render(<OrganisationOverview organisation={organisation} />);
    expect(screen.getByText('We help people.')).toBeInTheDocument();
  });

  it('renders with long description', () => {
    const organisation = {
      name: 'Helpful Org',
      description: 'Long detailed description.',
    };

    render(<OrganisationOverview organisation={organisation} />);
    expect(screen.getByText('Long detailed description.')).toBeInTheDocument();
  });
});
