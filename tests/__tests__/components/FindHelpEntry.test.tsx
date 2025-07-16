import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FindHelpEntry from '@/components/FindHelp/FindHelpEntry';
import { LocationProvider } from '@/contexts/LocationContext';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<LocationProvider>{ui}</LocationProvider>);
};

describe('FindHelpEntry (Legacy Component)', () => {
  // Note: This component is being replaced by LocationPrompt in the new location flow
  // These tests are maintained for backward compatibility during transition
  
  it('renders without crashing', () => {
    renderWithProvider(<FindHelpEntry />);
  });

  it('renders postcode input field when geolocation is not available', async () => {
    // Mock geolocation as unavailable
    delete (global.navigator as any).geolocation;

    renderWithProvider(<FindHelpEntry />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/enter your postcode/i)).toBeInTheDocument();
    });
  });

  it('renders continue button when postcode input is shown', async () => {
    // Mock geolocation as unavailable
    delete (global.navigator as any).geolocation;

    renderWithProvider(<FindHelpEntry />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });
  });

  it('submits postcode and calls API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          location: { lat: 53.0, lng: -2.0 }
        }),
      })
    ) as jest.Mock;

    // Mock geolocation as unavailable
    delete (global.navigator as any).geolocation;

    renderWithProvider(<FindHelpEntry />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/enter your postcode/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/enter your postcode/i), { target: { value: 'M1 1AE' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/geocode?postcode=M1%201AE')
      );
    });
  });

  it('shows alert on invalid postcode response', async () => {
    const alertSpy = jest.spyOn(window, 'alert');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ error: 'Invalid postcode' }),
      })
    ) as jest.Mock;

    // Mock geolocation as unavailable
    Object.defineProperty(global.navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    });

    renderWithProvider(<FindHelpEntry />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/enter your postcode/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/enter your postcode/i), { target: { value: 'INVALID' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringMatching(/something went wrong/i));
    });
  });

  it('uses browser geolocation when available', async () => {
    const mockGetCurrentPosition = jest.fn((success) => {
      success({ coords: { latitude: 10, longitude: 20 } });
    });
    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    renderWithProvider(<FindHelpEntry />);

    await waitFor(() => {
      expect(mockGetCurrentPosition).toHaveBeenCalled();
      expect(screen.getByText(/location set/i)).toBeInTheDocument();
    });
  });

  it('shows postcode form when geolocation fails', async () => {
    const mockGetCurrentPosition = jest.fn((_success, error) => error({
      code: 1,
      message: 'Permission denied'
    }));
    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    renderWithProvider(<FindHelpEntry />);

    await waitFor(() => {
      expect(screen.getByLabelText(/enter your postcode/i)).toBeInTheDocument();
    });
  });
});