import { render, screen } from '@testing-library/react';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';

describe('OrganisationContactBlock', () => {
  it('mentions organisation name in message', () => {
    render(<OrganisationContactBlock organisation={{ name: 'Org A' } as any} />);
    expect(
      screen.getByText(/We do not currently have public contact details for Org A./i)
    ).toBeInTheDocument();
  });
});
