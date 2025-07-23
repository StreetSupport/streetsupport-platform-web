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


});