/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      colors: {
        'brand-a': '#38ae8e',
        'brand-b': '#0b9b75',
        'brand-c': '#086049',
        'brand-d': '#ffa200',
        'brand-e': '#ffde00',
        'brand-f': '#8d8d8d',
        'brand-g': '#a90000',
        'brand-h': '#5a497f',
        'brand-i': '#f6e9d2',
        'brand-j': '#e1c116',
        'brand-k': '#48484a',
        'brand-l': '#29272a',
        'brand-m': '#101011',
        'brand-n': '#9886bf',
        'brand-p': '#086149',
        'brand-q': '#f3f3f3',
        'brand-r': '#0A8564',
        'brand-s': '#E1B500',
      },
      spacing: {
        'header': '44px',
        'header-subnav': '85px',
      },
      fontFamily: {
        sans: ['"museo_sans_rounded300"', 'sans-serif'],
        headline: ['"museo_sans_rounded500"', 'sans-serif'],
      },
      screens: {
        xs: '360px',
        s: '480px',
        m: '750px',
        l: '800px',
        xl: '960px',
        xxl: '1024px',
        xxxl: '1280px',
      },
    },
  },
  plugins: [],
};
