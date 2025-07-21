import { decodeHtmlEntities, decodeMarkdown, decodeText } from '@/utils/htmlDecode';

describe('htmlDecode utilities', () => {
  describe('decodeHtmlEntities', () => {
    it('should decode basic HTML entities', () => {
      expect(decodeHtmlEntities('&amp;')).toBe('&');
      expect(decodeHtmlEntities('&lt;')).toBe('<');
      expect(decodeHtmlEntities('&gt;')).toBe('>');
      expect(decodeHtmlEntities('&quot;')).toBe('"');
      expect(decodeHtmlEntities('&apos;')).toBe("'");
    });

    it('should decode numeric HTML entities', () => {
      expect(decodeHtmlEntities('&#65;')).toBe('A');
      expect(decodeHtmlEntities('&#x41;')).toBe('A');
    });

    it('should decode special characters', () => {
      expect(decodeHtmlEntities('&nbsp;')).toBe(' ');
      expect(decodeHtmlEntities('&ndash;')).toBe('–');
      expect(decodeHtmlEntities('&mdash;')).toBe('—');
      expect(decodeHtmlEntities('&lsquo;')).toBe('\u2018');
      expect(decodeHtmlEntities('&rsquo;')).toBe('\u2019');
      expect(decodeHtmlEntities('&ldquo;')).toBe('\u201c');
      expect(decodeHtmlEntities('&rdquo;')).toBe('\u201d');
      expect(decodeHtmlEntities('&pound;')).toBe('£');
      expect(decodeHtmlEntities('&euro;')).toBe('€');
    });

    it('should handle empty or null strings', () => {
      expect(decodeHtmlEntities('')).toBe('');
      expect(decodeHtmlEntities(null as any)).toBe('');
      expect(decodeHtmlEntities(undefined as any)).toBe('');
    });
  });

  describe('decodeMarkdown', () => {
    it('should remove markdown formatting', () => {
      expect(decodeMarkdown('**bold text**')).toBe('bold text');
      expect(decodeMarkdown('*italic text*')).toBe('italic text');
      expect(decodeMarkdown('__bold text__')).toBe('bold text');
      expect(decodeMarkdown('_italic text_')).toBe('italic text');
      expect(decodeMarkdown('`code text`')).toBe('code text');
      expect(decodeMarkdown('~~strikethrough~~')).toBe('strikethrough');
    });

    it('should remove markdown links', () => {
      expect(decodeMarkdown('[link text](https://example.com)')).toBe('link text');
    });

    it('should remove markdown headers', () => {
      expect(decodeMarkdown('# Header 1')).toBe('Header 1');
      expect(decodeMarkdown('## Header 2')).toBe('Header 2');
      expect(decodeMarkdown('### Header 3')).toBe('Header 3');
    });

    it('should remove list markers', () => {
      expect(decodeMarkdown('- List item')).toBe('List item');
      expect(decodeMarkdown('* List item')).toBe('List item');
      expect(decodeMarkdown('+ List item')).toBe('List item');
      expect(decodeMarkdown('1. Numbered item')).toBe('Numbered item');
    });

    it('should remove blockquotes', () => {
      expect(decodeMarkdown('> Quote text')).toBe('Quote text');
    });

    it('should handle empty or null strings', () => {
      expect(decodeMarkdown('')).toBe('');
      expect(decodeMarkdown(null as any)).toBe('');
      expect(decodeMarkdown(undefined as any)).toBe('');
    });
  });

  describe('decodeText', () => {
    it('should decode both HTML entities and markdown', () => {
      expect(decodeText('**Bold &amp; italic**')).toBe('Bold & italic');
      expect(decodeText('# Header with &quot;quotes&quot;')).toBe('Header with "quotes"');
      expect(decodeText('[Link](url) with &nbsp; space')).toBe('Link with   space');
    });

    it('should handle complex mixed content', () => {
      const input = '## **Important** &ndash; `code` &amp; [link](url)';
      const expected = 'Important – code & link';
      expect(decodeText(input)).toBe(expected);
    });

    it('should handle empty or null strings', () => {
      expect(decodeText('')).toBe('');
      expect(decodeText(null as any)).toBe('');
      expect(decodeText(undefined as any)).toBe('');
    });
  });
});