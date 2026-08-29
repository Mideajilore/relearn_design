/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens. Never use pure black (#000) anywhere in this app.
        grey: {
          900: '#101928', // main headers
          700: '#344054', // body text
          500: '#667185', // secondary text, labels
          300: '#D0D5DD', // input borders
          200: '#E4E7EC', // hairline borders / dividers
          50: '#F9FAFB', //  subtle surface backgrounds
        },
        success: '#12B76A', // completed states, streak highlight
        accent: '#101928', // one accent, used sparingly for primary actions
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        control: '8px',
      },
      maxWidth: {
        content: '64rem',
        reading: '48rem',
      },
    },
  },
  plugins: [],
};
