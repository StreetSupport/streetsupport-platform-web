import { render, screen } from '@testing-library/react';
import OrganisationFooter from '@/components/OrganisationPage/OrganisationFooter';

describe('OrganisationFooter', () => {
  it('renders disclaimer text', () => {
    render(<OrganisationFooter />);
    expect(screen.getByText(/Information provided by Street Support/i)).toBeInTheDocument();
  });

  it('shows social share links', () => {
    render(<OrganisationFooter />);
    expect(screen.getByText(/Share this page:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Share on Bluesky/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Share on Facebook/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Share on X/i })).toBeInTheDocument();
  });
});