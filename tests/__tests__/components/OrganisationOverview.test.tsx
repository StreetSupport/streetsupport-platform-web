import { render, screen } from '@testing-library/react';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';

describe('OrganisationOverview', () => {
  it('renders organisation name only', () => {
    const organisation = {
      Name: 'Helpful Org',
      ShortDescription: '',
      Description: '',
    };

    render(<OrganisationOverview organisation={organisation} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Helpful Org');
  });
});
