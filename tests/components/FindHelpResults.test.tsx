import { render, screen, fireEvent } from '@testing-library/react';
import * as locationHook from '@/contexts/LocationContext';
import FindHelpResults from '@/components/FindHelp/FindHelpResults';

// Mock service providers (simplified)
jest.mock('@/data/service-providers.json', () => [
  {
    id: '1',
    name: 'Test Org',
    postcode: 'LN4 2LE',
    latitude: 53.0,
    longitude: -0.5,
    verified: true,
    services: [
      {
        id: 's1',
        name: 'Health Clinic',
        category: 'health',
        subCategory: 'dentist',
        description: 'A dentist service.',
        openTimes: [],
        clientGroups: []
      }
    ]
  }
]);

describe('FindHelpResults', () => {
  const mockLocation = {
    location: { postcode: 'LN4 2LE' },
    setLocation: jest.fn()
  };

  beforeEach(() => {
    jest.spyOn(locationHook, 'useLocation').mockReturnValue(mockLocation);
  });

  it('renders filtered service based on postcode', () => {
    render(<FindHelpResults />);
    expect(screen.getByText(/Health Clinic/i)).toBeInTheDocument();
  });

  it('renders "Show map" button and toggles map', () => {
    render(<FindHelpResults />);
    const toggle = screen.getByRole('button', { name: /show map/i });
    expect(toggle).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByText(/Debug Log/i)).toBeInTheDocument();
  });

  it('renders "No services found" if location has no match', () => {
    jest.spyOn(locationHook, 'useLocation').mockReturnValue({
      location: { postcode: 'ZZ1 1ZZ' },
      setLocation: jest.fn()
    });

    render(<FindHelpResults />);
    expect(screen.getByText(/No services found/i)).toBeInTheDocument();
  });
});
