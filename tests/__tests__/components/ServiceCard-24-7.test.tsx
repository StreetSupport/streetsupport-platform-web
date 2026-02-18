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
  setLocationFromCoordinates: jest.fn(),
  updateRadius: jest.fn(),
  requestLocation: jest.fn(),
  clearLocation: jest.fn(),
  error: null,
  isLoading: false,
  clearError: jest.fn(),
};

describe('ServiceCard 24/7 functionality', () => {
  beforeEach(() => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams() as any);
  });

  it('should hide opening times and show 24/7 pill for services with isOpen247 flag', () => {
    const service247 = {
      ...mock24_7Service,
      isOpen247: true
    };

    render(
      <LocationContext.Provider value={mockLocationContextValue}>
        <ServiceCard
          service={service247}
          isOpen={false}
          onToggle={jest.fn()}
        />
      </LocationContext.Provider>
    );

    expect(screen.getByText('24/7 Crisis Support')).toBeInTheDocument();
    expect(screen.queryByText('Opening Times:')).not.toBeInTheDocument();
    expect(screen.queryByText('No opening times available')).not.toBeInTheDocument();
    expect(screen.getByText('Open 24/7')).toBeInTheDocument();
    expect(screen.queryByText('Open Now')).not.toBeInTheDocument();
  });

  it('should detect 24-hour services from opening times with 00:00-23:59 slots', () => {
    // mock24_7Service has openTimes with start: 0, end: 2359 but no isOpen247 flag
    render(
      <LocationContext.Provider value={mockLocationContextValue}>
        <ServiceCard
          service={mock24_7Service}
          isOpen={false}
          onToggle={jest.fn()}
        />
      </LocationContext.Provider>
    );

    expect(screen.queryByText('Opening Times:')).not.toBeInTheDocument();
    expect(screen.getByText('Open 24/7')).toBeInTheDocument();
    expect(screen.queryByText('Open Now')).not.toBeInTheDocument();
  });

  it('should show opening times for services with regular hours', () => {
    const regularService = {
      ...mock24_7Service,
      isOpen247: false,
      openTimes: [
        { day: 1, start: 900, end: 1700 },
        { day: 2, start: 900, end: 1700 },
      ],
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

    expect(screen.getByText('Opening Times:')).toBeInTheDocument();
    expect(screen.queryByText('Open 24/7')).not.toBeInTheDocument();
  });
});
