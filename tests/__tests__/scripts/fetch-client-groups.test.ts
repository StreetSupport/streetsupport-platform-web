import fs from 'fs';

describe('fetch-client-groups script output', () => {
  it('should create a valid client-groups.json file', () => {
    const raw = fs.readFileSync('src/data/client-groups.json', 'utf8');
    const data = JSON.parse(raw);

    expect(Array.isArray(data)).toBe(true);
    data.forEach(group => {
      expect(group).toHaveProperty('_id');
      expect(group).toHaveProperty('key');
      expect(group).toHaveProperty('name');
    });
  });
});
