// tests/__tests__/api/locations.test.ts

/**
 * A simple test to check the transform logic for locations
 * independent of DB connection or Next.js server runtime.
 */

interface RawLocation {
  _id: string;
  Name: string;
  Key: string;
}

interface ApiLocation {
  id: string;
  name: string;
  slug: string;
}

// ✅ This is the transform you use in your route:
function formatLocation(raw: RawLocation): ApiLocation {
  return {
    id: raw._id,
    name: raw.Name,
    slug: raw.Key,
  };
}

describe('formatLocation helper', () => {
  it('should format a raw location into API shape', () => {
    const raw = { _id: 'abc123', Name: 'Leeds', Key: 'leeds' };
    const expected = { id: 'abc123', name: 'Leeds', slug: 'leeds' };

    const result = formatLocation(raw);

    expect(result).toEqual(expected);
  });

  it('should format multiple locations correctly', () => {
    const rawList = [
      { _id: '1', Name: 'Leeds', Key: 'leeds' },
      { _id: '2', Name: 'Manchester', Key: 'manchester' },
    ];

    const formatted = rawList.map(formatLocation);

    expect(formatted).toEqual([
      { id: '1', name: 'Leeds', slug: 'leeds' },
      { id: '2', name: 'Manchester', slug: 'manchester' },
    ]);
  });
});
