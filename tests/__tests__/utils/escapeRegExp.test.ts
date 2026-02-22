import { escapeRegExp } from '@/utils/escapeRegExp';

describe('escapeRegExp', () => {
  it('returns an empty string unchanged', () => {
    expect(escapeRegExp('')).toBe('');
  });

  it('returns a plain string unchanged', () => {
    expect(escapeRegExp('manchester')).toBe('manchester');
  });

  it('escapes dots', () => {
    expect(escapeRegExp('a.b')).toBe('a\\.b');
  });

  it('escapes asterisks', () => {
    expect(escapeRegExp('a*b')).toBe('a\\*b');
  });

  it('escapes plus signs', () => {
    expect(escapeRegExp('a+b')).toBe('a\\+b');
  });

  it('escapes question marks', () => {
    expect(escapeRegExp('a?b')).toBe('a\\?b');
  });

  it('escapes caret', () => {
    expect(escapeRegExp('^start')).toBe('\\^start');
  });

  it('escapes dollar sign', () => {
    expect(escapeRegExp('end$')).toBe('end\\$');
  });

  it('escapes curly braces', () => {
    expect(escapeRegExp('a{3}')).toBe('a\\{3\\}');
  });

  it('escapes parentheses', () => {
    expect(escapeRegExp('(group)')).toBe('\\(group\\)');
  });

  it('escapes pipe', () => {
    expect(escapeRegExp('a|b')).toBe('a\\|b');
  });

  it('escapes square brackets', () => {
    expect(escapeRegExp('[abc]')).toBe('\\[abc\\]');
  });

  it('escapes backslash', () => {
    expect(escapeRegExp('a\\b')).toBe('a\\\\b');
  });

  it('escapes multiple metacharacters in one string', () => {
    const input = 'foo.*bar+(baz)?';
    const expected = 'foo\\.\\*bar\\+\\(baz\\)\\?';
    expect(escapeRegExp(input)).toBe(expected);
  });

  it('produces a string safe for use in new RegExp()', () => {
    const malicious = '.*+?^${}()|[]\\';
    const escaped = escapeRegExp(malicious);
    const regex = new RegExp(escaped);
    expect(regex.test(malicious)).toBe(true);
    expect(regex.test('anything else')).toBe(false);
  });
});
