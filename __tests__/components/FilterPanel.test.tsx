import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterPanel from '@/components/FindHelp/FilterPanel';

const originalError = console.error;
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (typeof msg === 'string' && msg.includes('not wrapped in act')) return;
    originalError(msg, ...args);
  });
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore();
});

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([
        {
          key: 'health',
          name: 'Health',
          subCategories: [
            { key: 'dentist', name: 'Dentist' },
            { key: 'gp', name: 'GP' }
          ]
        },
        {
          key: 'foodbank',
          name: 'Foodbank',
          subCategories: [
            { key: 'meals', name: 'Meals' },
            { key: 'parcels', name: 'Parcels' }
          ]
        }
      ])
  })
) as jest.Mock;

describe('FilterPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders category dropdown with options after fetch', async () => {
    render(<FilterPanel onFilterChange={() => {}} />);
    expect(await screen.findByRole('option', { name: /Health/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Foodbank/i })).toBeInTheDocument();
  });

  it('calls onFilterChange with correct values when category changes', async () => {
    const mockFilterChange = jest.fn();
    render(<FilterPanel onFilterChange={mockFilterChange} />);

    const categorySelect = await screen.findByLabelText(/category/i);
    await screen.findByRole('option', { name: /Foodbank/i });

    fireEvent.change(categorySelect, { target: { value: 'foodbank' } });

    await waitFor(() => {
      const lastCall = mockFilterChange.mock.calls.at(-1)?.[0];
      expect(lastCall).toEqual({ category: 'foodbank', subCategory: '' });
    });
  });

  it('shows subcategory options when a category is selected', async () => {
    render(<FilterPanel onFilterChange={() => {}} />);
    const categorySelect = await screen.findByLabelText(/category/i);
    await screen.findByRole('option', { name: /Foodbank/i });

    fireEvent.change(categorySelect, { target: { value: 'foodbank' } });

    expect(await screen.findByRole('option', { name: /Meals/i })).toBeInTheDocument();
    expect(await screen.findByRole('option', { name: /Parcels/i })).toBeInTheDocument();
  });
});
