import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterPanel from '@/components/FindHelp/FilterPanel';

function setup(selectedCategory = '', selectedSubCategory = '') {
  const setCategory = jest.fn();
  const setSub = jest.fn();
  const onResetFilters = jest.fn();
  const utils = render(
    <FilterPanel
      selectedCategory={selectedCategory}
      selectedSubCategory={selectedSubCategory}
      setSelectedCategory={setCategory}
      setSelectedSubCategory={setSub}
      onResetFilters={onResetFilters}
    />
  );
  return { setCategory, setSub, onResetFilters, rerender: utils.rerender };
}

describe('FilterPanel', () => {
  it('renders category dropdown with options', () => {
    setup();
    const select = screen.getByLabelText('Category:');
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Food/i })).toBeInTheDocument();
  });

  it('updates category and subcategory selections', async () => {
    const { setCategory, setSub, onResetFilters, rerender } = setup();
    const categorySelect = screen.getByLabelText('Category:');

    // ✅ Use the correct key now
    fireEvent.change(categorySelect, { target: { value: 'foodbank' } });

    await waitFor(() => expect(setCategory).toHaveBeenCalledWith('foodbank'));

    rerender(
      <FilterPanel
        selectedCategory="foodbank"
        selectedSubCategory=""
        setSelectedCategory={setCategory}
        setSelectedSubCategory={setSub}
        onResetFilters={onResetFilters}
      />
    );

    const subSelect = screen.getByLabelText('Subcategory:');
    expect(subSelect).not.toBeDisabled();

    const subOption = await screen.findByRole('option', { name: /Food Banks/i });
    expect(subOption).toBeInTheDocument();

    fireEvent.change(subSelect, { target: { value: 'general' } });
    expect(setSub).toHaveBeenCalledWith('general');
  });

  it('shows reset button only when filters are active', () => {
    // No active filters - button should not be visible
    const { rerender } = setup();
    expect(screen.queryByRole('button', { name: /reset filters/i })).not.toBeInTheDocument();

    // Category filter active - button should be visible
    rerender(
      <FilterPanel
        selectedCategory="foodbank"
        selectedSubCategory=""
        setSelectedCategory={jest.fn()}
        setSelectedSubCategory={jest.fn()}
        onResetFilters={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /reset filters/i })).toBeInTheDocument();

    // Subcategory filter active - button should be visible
    rerender(
      <FilterPanel
        selectedCategory=""
        selectedSubCategory="general"
        setSelectedCategory={jest.fn()}
        setSelectedSubCategory={jest.fn()}
        onResetFilters={jest.fn()}
      />
    );
    expect(screen.getByRole('button', { name: /reset filters/i })).toBeInTheDocument();
  });

  it('calls onResetFilters when reset button is clicked', () => {
    const { onResetFilters } = setup('foodbank', 'general');
    const resetButton = screen.getByRole('button', { name: /reset filters/i });
    
    fireEvent.click(resetButton);
    expect(onResetFilters).toHaveBeenCalledTimes(1);
  });
});
