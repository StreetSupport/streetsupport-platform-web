// tests/__tests__/api/locations.test.ts

import { getLocations, formatLocation } from '../../../src/app/api/locations/helper';

jest.mock('../../../src/utils/mongodb', () => ({
  getClientPromise: jest.fn(),
}));

const mockClient = {
  db: jest.fn().mockReturnThis(),
  collection: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
};

describe('getLocations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch cities and format them', async () => {
    const mockRaw = [
      { _id: '1', Name: 'Leeds', Key: 'leeds' },
      { _id: '2', Name: 'Manchester', Key: 'manchester' },
    ];

    mockClient.toArray.mockResolvedValueOnce(mockRaw);

    const { getClientPromise } = require('../../../src/utils/mongodb');
    getClientPromise.mockResolvedValueOnce(mockClient);

    const result = await getLocations();

    expect(mockClient.collection).toHaveBeenCalledWith('Cities');
    expect(result).toEqual([
      { id: '1', name: 'Leeds', slug: 'leeds' },
      { id: '2', name: 'Manchester', slug: 'manchester' },
    ]);
  });

  it('should throw if DB fails', async () => {
    const { getClientPromise } = require('../../../src/utils/mongodb');
    getClientPromise.mockRejectedValueOnce(new Error('DB error'));

    await expect(getLocations()).rejects.toThrow('DB error');
  });
});

describe('formatLocation', () => {
  it('should format a raw location correctly', () => {
    const raw = { _id: 'abc123', Name: 'Leeds', Key: 'leeds' };
    const expected = { id: 'abc123', name: 'Leeds', slug: 'leeds' };

    const result = formatLocation(raw);

    expect(result).toEqual(expected);
  });
});
