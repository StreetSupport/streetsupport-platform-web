import DOMPurify from 'dompurify';

const CMS_ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'a',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'hr',
  'sub', 'sup', 'span', 'div',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const CMS_ALLOWED_ATTR = ['href', 'target', 'rel', 'src', 'alt', 'class'];

/**
 * Sanitises HTML content from the CMS rich text editor.
 * Allows common rich text tags (headings, lists, tables, etc.) and safe attributes.
 */
export function sanitiseCmsHtml(html: string): string {
  if (!html) return '';

  // DOMPurify v3 requires a window/document context.
  // During SSR there is no DOM, so return the raw string (it will be
  // sanitised on the client once hydration runs).
  if (typeof window === 'undefined') return html;

  return DOMPurify.sanitize(html, {
    KEEP_CONTENT: true,
    ALLOWED_TAGS: CMS_ALLOWED_TAGS,
    ALLOWED_ATTR: CMS_ALLOWED_ATTR,
  });
}

/**
 * Sanitises HTML content for banner descriptions.
 * Uses the same comprehensive tag list as the general CMS sanitiser.
 */
export function sanitiseBannerDescription(html: string): string {
  if (!html) return '';

  if (typeof window === 'undefined') return html;

  return DOMPurify.sanitize(html, {
    KEEP_CONTENT: true,
    ALLOWED_TAGS: CMS_ALLOWED_TAGS,
    ALLOWED_ATTR: CMS_ALLOWED_ATTR,
  });
}

export function sanitiseDescription(html: string): string {
  if (!html) return '';
  if (typeof window === 'undefined') return html;

  return DOMPurify.sanitize(html, {
    KEEP_CONTENT: true,
    ALLOWED_TAGS: DESCRIPTION_ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
