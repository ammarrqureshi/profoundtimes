const typography = require('@tailwindcss/typography');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            h1: { color: '#1a202c', fontWeight: '700' },
            p: { marginTop: '0', marginBottom: '1em' },
            blockquote: { borderLeftColor: '#ccc', fontStyle: 'italic' },
            a: { textDecoration: 'none', color: '#000' }

          },
        },
      },
    },
  },
  plugins: [typography],
};
