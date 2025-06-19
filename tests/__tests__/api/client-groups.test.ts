// tests/__tests__/api/client-groups.test.ts

import { getClientGroups } from '../../../src/app/api/client-groups/helper';
import '../../setup/mongoMemory';

jest.mock('@/utils/mongodb', () => ({
  getClientPromise: jest.fn(),
}));

const mockClient = {
  db: jest.fn().mockReturnThis(),
  collection: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  project: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
};

describe('getClientGroups', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted client groups', async () => {
    const mockData = [
      { _id: '1', Key: 'refugees', Name: 'Refugees' },
      { _id: '2', Key: 'families', Name: 'Families' },
    ];

    mockClient.toArray.mockResolvedValueOnce(mockData);

    const { getClientPromise } = require('@/utils/mongodb');
    getClientPromise.mockResolvedValueOnce(mockClient);

    const result = await getClientGroups();

    expect(result).toEqual([
      { _id: '1', key: 'refugees', name: 'Refugees' },
      { _id: '2', key: 'families', name: 'Families' },
    ]);
  });

  it('should throw if the database call fails', async () => {
    const { getClientPromise } = require('@/utils/mongodb');
    getClientPromise.mockRejectedValueOnce(new Error('DB down'));

    await expect(getClientGroups()).rejects.toThrow('DB down');
  });
});
