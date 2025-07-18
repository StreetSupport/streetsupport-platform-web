import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import OrganisationContactBlock from '@/components/OrganisationPage/OrganisationContactBlock';
import { mockOrganisationDetails, mockMinimalOrganisationDetails } from '../../__mocks__/api-responses';

describe('OrganisationContactBlock', () => {
  it('shows no contact items if none are provided', () => {
    // Use the minimal organisation details which has no contact information
    render(<OrganisationContactBlock organisation={mockMinimalOrganisationDetails} />);

    // Heading always visible
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Contact Details');

    // Should have no rendered contact items
    const listItems = screen.queryAllByRole('listitem');
    expect(listItems.length).toBe(0);
  });

  it('renders all contact details when provided', () => {
    // Create a test organisation with all contact fields
    const organisation = {
      ...mockOrganisationDetails,
      email: 'contact@testorg.com',
      telephone: '01234567890',
      website: 'https://testorg.com',
      facebook: 'https://facebook.com/testorg',
      twitter: 'https://twitter.com/testorg'
    };

    render(<OrganisationContactBlock organisation={organisation} />);

    // Check heading
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Contact Details');

    // Check all contact items are rendered
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('contact@testorg.com')).toBeInTheDocument();
    
    expect(screen.getByText('Telephone:')).toBeInTheDocument();
    expect(screen.getByText('01234567890')).toBeInTheDocument();
    
    expect(screen.getByText('Website:')).toBeInTheDocument();
    expect(screen.getByText('https://testorg.com')).toBeInTheDocument();
    
    expect(screen.getByText('Facebook:')).toBeInTheDocument();
    expect(screen.getByText('https://facebook.com/testorg')).toBeInTheDocument();
    
    expect(screen.getByText('Twitter:')).toBeInTheDocument();
    expect(screen.getByText('https://twitter.com/testorg')).toBeInTheDocument();

    // Check that links have correct href attributes
    expect(screen.getByText('contact@testorg.com').closest('a')).toHaveAttribute('href', 'mailto:contact@testorg.com');
    expect(screen.getByText('01234567890').closest('a')).toHaveAttribute('href', 'tel:01234567890');
    expect(screen.getByText('https://testorg.com').closest('a')).toHaveAttribute('href', 'https://testorg.com');
    expect(screen.getByText('https://facebook.com/testorg').closest('a')).toHaveAttribute('href', 'https://facebook.com/testorg');
    expect(screen.getByText('https://twitter.com/testorg').closest('a')).toHaveAttribute('href', 'https://twitter.com/testorg');
  });

  it('renders only provided contact details', () => {
    // Create a test organisation with only some contact fields
    const organisation = {
      ...mockMinimalOrganisationDetails,
      email: 'contact@testorg.com',
      website: 'https://testorg.com'
      // No telephone, facebook or twitter
    };

    render(<OrganisationContactBlock organisation={organisation} />);

    // Check heading
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Contact Details');

    // Check only provided contact items are rendered
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Website:')).toBeInTheDocument();
    
    // These should not be in the document
    expect(screen.queryByText('Telephone:')).not.toBeInTheDocument();
    expect(screen.queryByText('Facebook:')).not.toBeInTheDocument();
    expect(screen.queryByText('Twitter:')).not.toBeInTheDocument();

    // Count list items - should be 2 (email and website)
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(2);
  });

  it('renders links with proper attributes', () => {
    // Create a test organisation with all contact fields
    const organisation = {
      ...mockOrganisationDetails,
      email: 'contact@testorg.com',
      telephone: '01234567890',
      website: 'https://testorg.com',
      facebook: 'https://facebook.com/testorg',
      twitter: 'https://twitter.com/testorg'
    };

    render(<OrganisationContactBlock organisation={organisation} />);

    // Check that external links have proper security attributes
    const websiteLink = screen.getByText('https://testorg.com').closest('a');
    expect(websiteLink).toHaveAttribute('target', '_blank');
    expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer');

    const facebookLink = screen.getByText('https://facebook.com/testorg').closest('a');
    expect(facebookLink).toHaveAttribute('target', '_blank');
    expect(facebookLink).toHaveAttribute('rel', 'noopener noreferrer');

    const twitterLink = screen.getByText('https://twitter.com/testorg').closest('a');
    expect(twitterLink).toHaveAttribute('target', '_blank');
    expect(twitterLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Email and telephone links should not have these attributes
    const emailLink = screen.getByText('contact@testorg.com').closest('a');
    expect(emailLink).not.toHaveAttribute('target');
    expect(emailLink).not.toHaveAttribute('rel');

    const telephoneLink = screen.getByText('01234567890').closest('a');
    expect(telephoneLink).not.toHaveAttribute('target');
    expect(telephoneLink).not.toHaveAttribute('rel');
  });
});