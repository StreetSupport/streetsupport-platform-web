import DOMPurify from 'dompurify';

const BANNER_ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 'a'];
const DESCRIPTION_ALLOWED_TAGS = ['p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li', 'a'];

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

export function sanitiseDescription(html: string): string {
  if (!html) return '';
  if (typeof window === 'undefined') return html;

  return DOMPurify.sanitize(html, {
    KEEP_CONTENT: true,
    ALLOWED_TAGS: DESCRIPTION_ALLOWED_TAGS,
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}
