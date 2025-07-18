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

  it('should handle category with empty subCategories array', () => {
    const raw = {
      key: 'empty-category',
      name: 'Empty Category',
      subCategories: [],
    };

    const expected = {
      key: 'empty-category',
      name: 'Empty Category',
      subCategories: [],
    };

    expect(formatCategory(raw)).toEqual(expected);
  });

  it('should handle category with many subCategories', () => {
    const raw = {
      key: 'medical',
      name: 'Health Services',
      subCategories: [
        { key: 'gp', name: 'General Practice' },
        { key: 'nurse', name: 'Practice Nurse' },
        { key: 'hospital', name: 'Hospital' },
        { key: 'dentist', name: 'Dentist' },
        { key: 'drug-alcohol', name: 'Drug and Alcohol Treatment' },
        { key: 'mental-health', name: 'Mental Health' },
        { key: 'sexual', name: 'Sexual Health' },
        { key: 'podiatry', name: 'Podiatry' },
        { key: 'counselling', name: 'Counselling' },
      ],
    };

    const result = formatCategory(raw);

    expect(result.key).toBe('medical');
    expect(result.name).toBe('Health Services');
    expect(result.subCategories).toHaveLength(9);
    expect(result.subCategories[0]).toEqual({ key: 'gp', name: 'General Practice' });
    expect(result.subCategories[8]).toEqual({ key: 'counselling', name: 'Counselling' });
  });

  it('should handle category with special characters in names', () => {
    const raw = {
      key: 'special-chars',
      name: 'Category with "Special" & Characters',
      subCategories: [
        { key: 'sub-special', name: 'Sub with & special chars' },
        { key: 'apostrophe', name: "Sub with apostrophe's" },
      ],
    };

    const result = formatCategory(raw);

    expect(result.key).toBe('special-chars');
    expect(result.name).toBe('Category with "Special" & Characters');
    expect(result.subCategories[0].name).toBe('Sub with & special chars');
    expect(result.subCategories[1].name).toBe("Sub with apostrophe's");
  });

  it('should handle category with long names', () => {
    const raw = {
      key: 'long-name-category',
      name: 'This is a very long category name that might be used in some cases',
      subCategories: [
        { 
          key: 'long-sub-name', 
          name: 'This is also a very long subcategory name that should be handled properly' 
        },
      ],
    };

    const result = formatCategory(raw);

    expect(result.key).toBe('long-name-category');
    expect(result.name).toBe('This is a very long category name that might be used in some cases');
    expect(result.subCategories[0].name).toBe('This is also a very long subcategory name that should be handled properly');
  });

  it('should handle category with hyphenated keys', () => {
    const raw = {
      key: 'multi-word-key',
      name: 'Multi Word Category',
      subCategories: [
        { key: 'sub-multi-word', name: 'Sub Multi Word' },
        { key: 'another-hyphenated-key', name: 'Another Hyphenated Name' },
      ],
    };

    const result = formatCategory(raw);

    expect(result.key).toBe('multi-word-key');
    expect(result.name).toBe('Multi Word Category');
    expect(result.subCategories[0].key).toBe('sub-multi-word');
    expect(result.subCategories[1].key).toBe('another-hyphenated-key');
  });

  it('should preserve exact structure of input data', () => {
    const raw = {
      key: 'preservation-test',
      name: 'Preservation Test',
      subCategories: [
        { key: 'test1', name: 'Test 1' },
        { key: 'test2', name: 'Test 2' },
      ],
    };

    const result = formatCategory(raw);

    // Should be a deep copy, not the same reference
    expect(result).not.toBe(raw);
    expect(result.subCategories).not.toBe(raw.subCategories);
    
    // But should have identical content
    expect(result).toEqual(raw);
  });

  it('should handle real-world category data structure', () => {
    // Test with actual data structure from service-categories.json
    const raw = {
      key: 'communications',
      name: 'Communications',
      subCategories: [
        { key: 'telephone', name: 'Telephone' },
        { key: 'internet', name: 'Internet access' },
        { key: 'wi-fi-access', name: 'Wi-Fi access' },
        { key: 'computer-digital-skills', name: 'Computer/Digital skills' },
      ],
    };

    const result = formatCategory(raw);

    expect(result).toEqual({
      key: 'communications',
      name: 'Communications',
      subCategories: [
        { key: 'telephone', name: 'Telephone' },
        { key: 'internet', name: 'Internet access' },
        { key: 'wi-fi-access', name: 'Wi-Fi access' },
        { key: 'computer-digital-skills', name: 'Computer/Digital skills' },
      ],
    });
  });
});
