import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FilterPanel from '@/components/FindHelp/FilterPanel';

function setup(selectedCategory = '', selectedSubCategory = '') {
  const setCategory = jest.fn();
  const setSub = jest.fn();
  const utils = render(
    <FilterPanel
      selectedCategory={selectedCategory}
      selectedSubCategory={selectedSubCategory}
      setSelectedCategory={setCategory}
      setSelectedSubCategory={setSub}
    />
  );
  return { setCategory, setSub, ...utils };
}

describe('FilterPanel', () => {
  it('renders category dropdown with options', () => {
    setup();
    const select = screen.getByLabelText('Category:');
    expect(select).toBeInTheDocument();
    // Check a known category from the data file
    expect(screen.getByRole('option', { name: /Food/i })).toBeInTheDocument();
  });

  it('updates category and subcategory selections', async () => {
    const { setCategory, setSub, rerender } = setup();
    const categorySelect = screen.getByLabelText('Category:');

    fireEvent.change(categorySelect, { target: { value: 'foodbank' } });

    await waitFor(() => expect(setCategory).toHaveBeenCalledWith('foodbank'));

    rerender(
      <FilterPanel
        selectedCategory="foodbank"
        selectedSubCategory=""
        setSelectedCategory={setCategory}
        setSelectedSubCategory={setSub}
      />
    );

    const subSelect = screen.getByLabelText('Subcategory:');
    expect(subSelect).not.toBeDisabled();

    await waitFor(() =>
      expect(screen.getByRole('option', { name: /Food Banks/i })).toBeInTheDocument()
    );

    fireEvent.change(subSelect, { target: { value: 'general' } });
    expect(setSub).toHaveBeenCalledWith('general');
  });
});
