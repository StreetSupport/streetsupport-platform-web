import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FindHelpEntry from '@/components/FindHelp/FindHelpEntry';
import { LocationProvider } from '@/contexts/LocationContext';

const mockOrgWithNoServices = {
  name: 'Test Org',
  services: [],
};

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<LocationProvider>{ui}</LocationProvider>);
};

describe('FindHelpEntry', () => {
  it('renders without crashing', () => {
    renderWithProvider(<FindHelpEntry organisation={mockOrgWithNoServices} />);
  });

  it('renders postcode input field', () => {
    renderWithProvider(<FindHelpEntry organisation={mockOrgWithNoServices} />);
    expect(screen.getByLabelText(/enter your postcode/i)).toBeInTheDocument();
  });

  it('renders continue button', () => {
    renderWithProvider(<FindHelpEntry organisation={mockOrgWithNoServices} />);
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('does not show location status initially', () => {
    renderWithProvider(<FindHelpEntry organisation={mockOrgWithNoServices} />);
    expect(screen.queryByText(/services near/i)).not.toBeInTheDocument();
  });

  it('submits postcode and calls API', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ latitude: 53.0, longitude: -2.0 }),
      })
    ) as jest.Mock;

    renderWithProvider(<FindHelpEntry organisation={mockOrgWithNoServices} />);
    fireEvent.change(screen.getByLabelText(/enter your postcode/i), { target: { value: 'M1 1AE' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it('shows alert on invalid postcode response', async () => {
    const alertSpy = jest.spyOn(window, 'alert');
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: 'Invalid postcode' }),
      })
    ) as jest.Mock;

    renderWithProvider(<FindHelpEntry organisation={mockOrgWithNoServices} />);
    fireEvent.change(screen.getByLabelText(/enter your postcode/i), { target: { value: 'INVALID' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(expect.stringMatching(/something went wrong/i));
    });
  });
});
