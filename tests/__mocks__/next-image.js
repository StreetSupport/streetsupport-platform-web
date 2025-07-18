// Enhanced mock for next/image
const React = require('react');

const nextImage = ({ src, alt, width, height, priority, quality, loading, placeholder, blurDataURL, ...props }) => {
  return React.createElement('img', {
    src: src || '',
    alt: alt || '',
    width: width,
    height: height,
    loading: loading || 'lazy',
    ...props,
    'data-testid': props['data-testid'] || 'next-image'
  });
};

module.exports = {
  __esModule: true,
  default: nextImage,
};