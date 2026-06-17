/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-sun': '#ef8b2c',
        'brand-rose': '#b01949',
        'brand-orchid': '#be4ac3',
        'brand-plum': '#762464',
        ink: '#1f1f24',
        surface: '#f2f4f7',
        mist: '#e8ecf1',
      },
      fontFamily: {
        display: ['"Fraunces"', '"Georgia"', 'serif'],
        body: ['"Source Sans 3"', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
