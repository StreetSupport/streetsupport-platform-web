module.exports = {
  root: true,
  extends: ['next', 'next/core-web-vitals'],
  rules: {
    // Custom rules can be added here
    'react/jsx-key': 'warn',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    '@next/next/no-img-element': 'off'
  }
};
