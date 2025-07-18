// Enhanced mock for next/link
const React = require('react');

const nextLink = ({ children, href, as, replace, scroll, shallow, passHref, prefetch, locale, ...props }) => {
  return React.createElement('a', { 
    href: href || '/', 
    onClick: (e) => {
      // Prevent actual navigation in tests
      e.preventDefault();
      if (props.onClick) props.onClick(e);
    },
    ...props,
    'data-testid': props['data-testid'] || 'next-link'
  }, children);
};

module.exports = {
  __esModule: true,
  default: nextLink,
};