// Mock for react-markdown to avoid ESM issues in Jest
const React = require('react');

function ReactMarkdown({ children, className, ...props }) {
  // Filter out any invalid props that shouldn't be passed to DOM elements
  const validProps = {};
  const allowedProps = ['className', 'id', 'data-testid', 'aria-label', 'role'];
  
  Object.keys(props).forEach(key => {
    if (allowedProps.includes(key) || key.startsWith('data-') || key.startsWith('aria-')) {
      validProps[key] = props[key];
    }
  });
  
  if (className) {
    validProps.className = className;
  }

  // Simple mock that renders the content as plain text
  return React.createElement('div', {
    'data-testid': 'markdown-content',
    ...validProps
  }, children);
}

module.exports = ReactMarkdown;