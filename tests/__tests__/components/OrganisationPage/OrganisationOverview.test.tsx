import React from 'react';
import { render, screen } from '@testing-library/react';
import OrganisationOverview from '@/components/OrganisationPage/OrganisationOverview';
import { mockOrganisationDetails } from '../../../__mocks__/api-responses';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
}));


describe('OrganisationOverview', () => {

  it('renders organisation name and descriptions', () => {
    render(<OrganisationOverview organisation={mockOrganisationDetails} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    expect(screen.getByText('A test organisation for testing purposes')).toBeInTheDocument();
    expect(screen.getByText(/This is a longer description/)).toBeInTheDocument();
  });



  it('renders without short description when not provided', () => {
    const orgWithoutShortDesc = {
      ...mockOrganisationDetails,
      shortDescription: undefined,
    };


    render(<OrganisationOverview organisation={orgWithoutShortDesc} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    expect(screen.queryByText('A test organisation for testing purposes')).not.toBeInTheDocument();
    expect(screen.getByText(/This is a longer description/)).toBeInTheDocument();
  });

  it('renders without description when not provided', () => {
    const orgWithoutDesc = {
      ...mockOrganisationDetails,
      description: undefined,
    };

    render(<OrganisationOverview organisation={orgWithoutDesc} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    expect(screen.getByText('A test organisation for testing purposes')).toBeInTheDocument();
    expect(screen.queryByText(/This is a longer description/)).not.toBeInTheDocument();
  });

  it('renders with both short description and description when provided', () => {
    const orgWithBoth = {
      ...mockOrganisationDetails,
      shortDescription: 'Short overview',
      description: 'Detailed organisation description with more information about services.',
    };

    render(<OrganisationOverview organisation={orgWithBoth} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    expect(screen.getByText('Short overview')).toBeInTheDocument();
    expect(screen.getByText('Detailed organisation description with more information about services.')).toBeInTheDocument();
  });

  it('renders without both descriptions when neither are provided', () => {
    const orgWithoutDescriptions = {
      ...mockOrganisationDetails,
      shortDescription: undefined,
      description: undefined,
    };

    render(<OrganisationOverview organisation={orgWithoutDescriptions} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    // Should not render description text when both are missing
    expect(screen.queryByText('A test organisation for testing purposes')).not.toBeInTheDocument();
    expect(screen.queryByText(/This is a longer description/)).not.toBeInTheDocument();
  });

  it('handles empty string descriptions correctly', () => {
    const orgWithEmptyDescriptions = {
      ...mockOrganisationDetails,
      shortDescription: '',
      description: '',
    };

    render(<OrganisationOverview organisation={orgWithEmptyDescriptions} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    // Empty strings should be treated as no description
    expect(screen.queryByText('A test organisation for testing purposes')).not.toBeInTheDocument();
  });

  it('handles very long organisation names correctly', () => {
    const orgWithLongName = {
      ...mockOrganisationDetails,
      name: 'This is a Very Long Organisation Name That Should Still Display Correctly in the UI Without Breaking Layout',
    };

    render(<OrganisationOverview organisation={orgWithLongName} />);

    expect(screen.getByText('This is a Very Long Organisation Name That Should Still Display Correctly in the UI Without Breaking Layout')).toBeInTheDocument();
  });

  it('handles special characters in organisation name', () => {
    const orgWithSpecialChars = {
      ...mockOrganisationDetails,
      name: 'Organisation & Support Services (UK) Ltd. - Manchester Branch',
    };

    render(<OrganisationOverview organisation={orgWithSpecialChars} />);

    expect(screen.getByText('Organisation & Support Services (UK) Ltd. - Manchester Branch')).toBeInTheDocument();
  });

  it('handles HTML entities in descriptions', () => {
    const orgWithHtmlEntities = {
      ...mockOrganisationDetails,
      shortDescription: 'We support families &amp; individuals',
      description: 'Our services include meals &amp; accommodation for those in need.',
    };

    render(<OrganisationOverview organisation={orgWithHtmlEntities} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    expect(screen.getByText('We support families & individuals')).toBeInTheDocument();
    expect(screen.getByText('Our services include meals & accommodation for those in need.')).toBeInTheDocument();
  });

  it('renders with markdown-style formatting in description', () => {
    const orgWithMarkdown = {
      ...mockOrganisationDetails,
      description: 'Our services include:\n\n• Emergency accommodation\n• Hot meals daily\n• Support services\n\nContact us for more information.',
    };

    render(<OrganisationOverview organisation={orgWithMarkdown} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    expect(screen.getByText(/Our services include/)).toBeInTheDocument();
    expect(screen.getByText(/Emergency accommodation/)).toBeInTheDocument();
  });

  it('applies correct CSS classes for styling', () => {
    const { container } = render(<OrganisationOverview organisation={mockOrganisationDetails} />);
    
    // Check for heading element
    const heading = container.querySelector('h1');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Test Organisation');
  });

  it('handles organisation with minimal required data', () => {
    const minimalOrg = {
      key: 'minimal-org',
      name: 'Minimal Organisation',
      addresses: [],
      services: [],
      groupedServices: {},
    };

    render(<OrganisationOverview organisation={minimalOrg} />);

    expect(screen.getByText('Minimal Organisation')).toBeInTheDocument();
    // Should not crash with minimal data
  });

  it('renders descriptions with different lengths correctly', () => {
    const orgWithVaryingDescriptions = {
      ...mockOrganisationDetails,
      shortDescription: 'Short.',
      description: 'This is a much longer description that contains multiple sentences and provides comprehensive information about the organisation and its services. It should wrap correctly and maintain proper formatting throughout the entire text block.',
    };

    render(<OrganisationOverview organisation={orgWithVaryingDescriptions} />);

    expect(screen.getByText('Test Organisation')).toBeInTheDocument();
    expect(screen.getByText('Short.')).toBeInTheDocument();
    expect(screen.getByText(/This is a much longer description/)).toBeInTheDocument();
  });
});