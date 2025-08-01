import React from 'react';
import { render, screen } from '@testing-library/react';
import ServiceCard from '@/components/FindHelp/ServiceCard';
import { mock24_7Service } from '../../__mocks__/api-responses';
import { LocationContext } from '@/contexts/LocationContext';
import { useSearchParams } from 'next/navigation';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}));

const mockUseSearchParams = useSearchParams as jest.MockedFunction<typeof useSearchParams>;

// Mock location context
const mockLocationContextValue = {
  location: null,
  setLocation: jest.fn(),
  updateRadius: jest.fn(),
  clearLocation: jest.fn(),
  isLoading: false,
};

describe('ServiceCard 24/7 functionality', () => {
  beforeEach(() => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);
  });

  it('should hide opening times for services with 24/7 tags', () => {
    render(
      <LocationContext.Provider value={mockLocationContextValue}>
        <ServiceCard 
          service={mock24_7Service}
          isOpen={false}
          onToggle={jest.fn()}
        />
      </LocationContext.Provider>
    );

    // The service name should be visible
    expect(screen.getByText('24/7 Crisis Support')).toBeInTheDocument();
    
    // Opening times should NOT be visible for 24/7 services
    expect(screen.queryByText('Opening Times:')).not.toBeInTheDocument();
    
    // Should show "No opening times available" instead
    expect(screen.getByText('No opening times available')).toBeInTheDocument();
  });

  it('should show opening times for services without 24/7 tags', () => {
    const regularService = {
      ...mock24_7Service,
      organisation: {
        ...mock24_7Service.organisation,
        tags: ['crisis', 'emergency'], // No 24/7 tag
      }
    };

    render(
      <LocationContext.Provider value={mockLocationContextValue}>
        <ServiceCard 
          service={regularService}
          isOpen={false}
          onToggle={jest.fn()}
        />
      </LocationContext.Provider>
    );

    // Opening times should be visible for regular services
    expect(screen.getByText('Opening Times:')).toBeInTheDocument();
  });
});