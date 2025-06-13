import { render, screen } from '@testing-library/react';
import OrganisationFooter from '@/components/OrganisationPage/OrganisationFooter';

describe('OrganisationFooter', () => {
  it('renders disclaimer text', () => {
    render(<OrganisationFooter />);
    expect(screen.getByText(/Information provided by Street Support/i)).toBeInTheDocument();
  });
});
