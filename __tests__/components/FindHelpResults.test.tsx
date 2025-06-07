import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FindHelpResults from '@/components/FindHelp/FindHelpResults';
import { LocationProvider } from '@/contexts/LocationContext';
import { FilterContextProvider } from '@/contexts/FilterContext';
import { act as reactAct } from 'react';

// ✅ Use the manual mock located in __mocks__
jest.mock('@/components/FindHelp/FilterPanel', () =>
  require('../../__mocks__/FilterPanel.tsx')
);

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LocationProvider>
      <FilterContextProvider>{ui}</FilterContextProvider>
    </LocationProvider>
  );
}

describe('FindHelpResults', () => {
  beforeEach(() => {
    (globalThis as any).capturedFilterChange = undefined;
  });

  it('renders filtered service based on location', async () => {
    renderWithProviders(<FindHelpResults />);

    await waitFor(() => {
      expect(typeof (globalThis as any).capturedFilterChange).toBe('function');
    });

    const capturedFilterChange = (globalThis as any).capturedFilterChange;

    reactAct(() => {
      capturedFilterChange({
        category: 'health',
        subCategory: 'gp',
      });
    });

    await waitFor(() => {
      expect(screen.getByText(/Services near you/i)).toBeInTheDocument();
    });
  });

  it('toggles map view when "Show map" is clicked', async () => {
    renderWithProviders(<FindHelpResults />);
    const button = screen.getByRole('button', { name: /show map/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(screen.getByText(/Hide map/i)).toBeInTheDocument();
  });

  it('renders "No services found" if location has no match', async () => {
    renderWithProviders(<FindHelpResults />);
    await waitFor(() => {
      expect(screen.getByText(/No services found within/i)).toBeInTheDocument();
    });
  });
});
