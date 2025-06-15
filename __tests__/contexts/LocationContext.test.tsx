import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { LocationProvider, useLocation } from '@/contexts/LocationContext';

function Consumer() {
  const { location, setLocation, requestLocation } = useLocation();
  return (
    <div>
      <span data-testid="loc">{location ? JSON.stringify(location) : 'null'}</span>
      <button onClick={() => setLocation({ lat: 1, lng: 2 })}>set</button>
      <button onClick={requestLocation}>request</button>
    </div>
  );
}

describe('LocationContext', () => {
  it('throws if useLocation is used outside provider', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow('useLocation must be used within a LocationProvider');
    (console.error as jest.Mock).mockRestore();
  });

  it('updates location via setLocation', () => {
    render(
      <LocationProvider>
        <Consumer />
      </LocationProvider>
    );
    fireEvent.click(screen.getByText('set'));
    expect(screen.getByTestId('loc').textContent).toBe('{"lat":1,"lng":2}');
  });

  it('requests location using geolocation API', async () => {
    const mockGetCurrentPosition = jest.fn((success) => {
      success({ coords: { latitude: 3, longitude: 4 } });
    });
    Object.defineProperty(global.navigator, 'geolocation', {
      value: { getCurrentPosition: mockGetCurrentPosition },
      configurable: true,
    });

    render(
      <LocationProvider>
        <Consumer />
      </LocationProvider>
    );

    fireEvent.click(screen.getByText('request'));

    await waitFor(() => {
      expect(screen.getByTestId('loc').textContent).toBe('{"lat":3,"lng":4}');
    });
  });
});
