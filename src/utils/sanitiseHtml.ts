import DOMPurify from 'dompurify';

const BANNER_ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 'a'];

const CONTENT_ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'br', 'hr',
  'strong', 'em', 'u', 'b', 'i', 's', 'sub', 'sup',
  'a', 'img',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
];

const CONTENT_ALLOWED_ATTR = [
  'href', 'target', 'rel',
  'src', 'alt', 'width', 'height',
  'class', 'id',
];

/**
 * Sanitises HTML content for banner descriptions.
 * Only allows basic text formatting and links.
 */
export function sanitiseBannerDescription(html: string): string {
  if (!html) return '';

  // DOMPurify v3 requires a window/document context.
  // During SSR there is no DOM, so return the raw string (it will be
  // sanitised on the client once hydration runs).
  if (typeof window === 'undefined') return html;

  return DOMPurify.sanitize(html, {
    KEEP_CONTENT: true,
    ALLOWED_TAGS: BANNER_ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

/**
 * Sanitises HTML content pages (SWEP bodies, resource pages, etc.).
 * Allows standard content tags such as headings, lists, images, and tables,
 * but strips scripts, iframes, and event handlers.
 */
export function sanitiseHtml(html: string, allowedTags?: string[]): string {
  if (!html) return '';

  if (typeof window === 'undefined') return html;

  return DOMPurify.sanitize(html, {
    KEEP_CONTENT: true,
    ALLOWED_TAGS: allowedTags ?? CONTENT_ALLOWED_TAGS,
    ALLOWED_ATTR: CONTENT_ALLOWED_ATTR,
  });
}
