// tests/__tests__/api/categories.test.ts

import { getCategories } from '../../../src/app/api/categories/helper';
import type { RawCategory } from '../../../src/utils/formatCategories';

jest.mock('../../../src/utils/mongodb', () => ({
  getClientPromise: jest.fn(),
}));

jest.mock('../../../src/utils/formatCategories', () => ({
  formatCategory: jest.fn(),
}));

const mockClient = {
  db: jest.fn().mockReturnThis(),
  collection: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
};

describe('getCategories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch categories and format them', async () => {
    const mockDbCategories = [
      {
        _id: 'food',
        Name: 'Food',
        SubCategories: [
          { Key: 'hot-food', Name: 'Hot Food' },
        ],
      },
    ];

    const expectedNormalized = {
      key: 'food',
      name: 'Food',
      subCategories: [
        { key: 'hot-food', name: 'Hot Food' },
      ],
    };

    mockClient.toArray.mockResolvedValueOnce(mockDbCategories);

    const { getClientPromise } = require('../../../src/utils/mongodb');
    getClientPromise.mockResolvedValueOnce(mockClient);

    const { formatCategory } = require('../../../src/utils/formatCategories');
    formatCategory.mockImplementation((cat: RawCategory) => ({
      ...cat,
      formatted: true,
    }));

    const result = await getCategories();

    expect(mockClient.collection).toHaveBeenCalledWith('NestedServiceCategories');
    expect(formatCategory).toHaveBeenCalledTimes(1);
    expect(formatCategory).toHaveBeenCalledWith(expectedNormalized);
    expect(result).toEqual([{ ...expectedNormalized, formatted: true }]);
  });

  it('should throw if database fails', async () => {
    const { getClientPromise } = require('../../../src/utils/mongodb');
    getClientPromise.mockRejectedValueOnce(new Error('DB fail'));

    await expect(getCategories()).rejects.toThrow('DB fail');
  });
});
