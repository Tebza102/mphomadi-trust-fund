/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Approved Mpho Madi Trust Fund brand palette.
        'brand-red': '#E42313',
        'brand-green': '#00843D',
        'brand-blue': '#0057B8',
        'brand-navy': '#102A56',
        'brand-gold': '#FFB612',
        'brand-black': '#111111',
        'brand-white': '#FFFFFF',

        // Semantic UI colours.
        primary: '#102A56',
        secondary: '#00843D',
        accent: '#FFB612',
        danger: '#E42313',
        ink: '#1B2430',
        surface: '#FFFFFF',
        mist: '#F3F5F7',
        border: '#D8DEE6',

        // Legacy aliases retained so existing approved page markup inherits the
        // new brand system without a risky page-by-page rewrite.
        'brand-sun': '#FFB612',
        'brand-rose': '#E42313',
        'brand-orchid': '#00843D',
        'brand-plum': '#102A56',
      },
      fontFamily: {
        display: ['"Fraunces"', '"Georgia"', 'serif'],
        body: ['"Source Sans 3"', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        brand: '1.25rem',
        'brand-lg': '2rem',
      },
      boxShadow: {
        'brand-sm': '0 6px 18px rgba(16, 42, 86, 0.08)',
        brand: '0 14px 40px rgba(16, 42, 86, 0.12)',
      },
    },
  },
  plugins: [],
}
