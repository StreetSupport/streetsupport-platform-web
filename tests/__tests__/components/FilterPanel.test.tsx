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
  return { setCategory, setSub, rerender: utils.rerender };
}

describe('FilterPanel', () => {
  it('renders category dropdown with options', () => {
    setup();
    const select = screen.getByLabelText('Category:');
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Food/i })).toBeInTheDocument();
  });

  it('updates category and subcategory selections', async () => {
    const { setCategory, setSub, rerender } = setup();
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
      />
    );

    const subSelect = screen.getByLabelText('Subcategory:');
    expect(subSelect).not.toBeDisabled();

    const subOption = await screen.findByRole('option', { name: /Food Banks/i });
    expect(subOption).toBeInTheDocument();

    fireEvent.change(subSelect, { target: { value: 'general' } });
    expect(setSub).toHaveBeenCalledWith('general');
  });
});
