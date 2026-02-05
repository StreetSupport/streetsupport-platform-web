import { getFaqs } from '../../../src/app/api/faqs/helper';

jest.mock('../../../src/utils/mongodb', () => ({
  getClientPromise: jest.fn(),
}));

const mockClient = {
  db: jest.fn().mockReturnThis(),
  collection: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  project: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  toArray: jest.fn(),
};

describe('getFaqs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return formatted FAQs without location filter', async () => {
    const mockData = [
      {
        _id: '1',
        LocationKey: 'manchester',
        Title: 'Where can I get food?',
        Body: 'Here is how...',
        SortPosition: 1,
        Tags: ['food'],
      },
    ];

    mockClient.toArray.mockResolvedValueOnce(mockData);

    const { getClientPromise } = require('../../../src/utils/mongodb');
    getClientPromise.mockResolvedValueOnce(mockClient);

    const result = await getFaqs();

    expect(result).toEqual([
      {
        _id: '1',
        locationKey: 'manchester',
        title: 'Where can I get food?',
        body: 'Here is how...',
        sortPosition: 1,
        tags: ['food'],
      },
    ]);
  });

  it('should pass locationKey to the query when provided', async () => {
    const mockData: unknown[] = [];
    mockClient.toArray.mockResolvedValueOnce(mockData);

    const { getClientPromise } = require('../../../src/utils/mongodb');
    getClientPromise.mockResolvedValueOnce(mockClient);

    await getFaqs('bolton');

    expect(mockClient.collection).toHaveBeenCalledWith('FAQs');
    expect(mockClient.find).toHaveBeenCalledWith({ LocationKey: 'bolton' });
  });

  it('should throw if database call fails', async () => {
    const { getClientPromise } = require('../../../src/utils/mongodb');
    getClientPromise.mockRejectedValueOnce(new Error('DB error'));

    await expect(getFaqs()).rejects.toThrow('DB error');
  });
});
