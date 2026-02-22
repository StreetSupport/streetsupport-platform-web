import { escapeHtml } from '@/utils/escapeHtml';

describe('escapeHtml', () => {
  it('returns an empty string unchanged', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('returns a plain string unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  it('escapes ampersands', () => {
    expect(escapeHtml('a & b')).toBe('a &amp; b');
  });

  it('escapes less-than signs', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
  });

  it('escapes greater-than signs', () => {
    expect(escapeHtml('a > b')).toBe('a &gt; b');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('say "hello"')).toBe('say &quot;hello&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#39;s');
  });

  it('escapes all special characters in one string', () => {
    expect(escapeHtml('<a href="x">&\'test\'')).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;test&#39;'
    );
  });

  it('prevents script injection', () => {
    const malicious = '<script>alert("xss")</script>';
    const escaped = escapeHtml(malicious);
    expect(escaped).not.toContain('<script>');
    expect(escaped).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('handles attribute breakout attempts', () => {
    const malicious = '" onmouseover="alert(1)"';
    const escaped = escapeHtml(malicious);
    expect(escaped).not.toContain('"');
    expect(escaped).toBe('&quot; onmouseover=&quot;alert(1)&quot;');
  });
});
