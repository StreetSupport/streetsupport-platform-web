import { formatCategory } from '@/utils/formatCategories';

describe('formatCategory helper', () => {
  it('should format a raw category correctly', () => {
    const raw = {
      key: 'health',
      name: 'Health',
      subCategories: [
        { key: 'dentist', name: 'Dentist' },
        { key: 'gp', name: 'GP' },
      ],
    };

    const expected = {
      key: 'health',
      name: 'Health',
      subCategories: [
        { key: 'dentist', name: 'Dentist' },
        { key: 'gp', name: 'GP' },
      ],
    };

    expect(formatCategory(raw)).toEqual(expected);
  });

  it('should format multiple categories', () => {
    const rawList = [
      {
        key: 'health',
        name: 'Health',
        subCategories: [
          { key: 'dentist', name: 'Dentist' },
          { key: 'gp', name: 'GP' },
        ],
      },
      {
        key: 'foodbank',
        name: 'Foodbank',
        subCategories: [
          { key: 'meals', name: 'Meals' },
          { key: 'parcels', name: 'Parcels' },
        ],
      },
    ];

    const formatted = rawList.map(formatCategory);

    expect(formatted).toEqual(rawList);
  });
});
