/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    '!./docs/**/*' // Exclude documentation files from Tailwind processing
  ],
  theme: {
    extend: {
      spacing: {
        'base-font-size': '1.0rem',
        'border-radius': '0.625rem',
        'border-radius-small': '0.3125rem',
        'header-top': '7.3125rem',
        'header-height': '2.625rem',
        'header-margin': '2.75rem',
        'header-subnav-height': '5.3125rem',
        'header-subnav-margin': '5.3125rem',
      },
      height: {
        'screen-header': 'calc(100vh - 4rem)',
      },
    },
  },
  plugins: [],
};