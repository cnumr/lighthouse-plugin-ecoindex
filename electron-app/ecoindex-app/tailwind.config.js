/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        'ecoindex-green': {
          50: '#ebfef6',
          100: '#d0fbe6',
          200: '#a4f6d3',
          300: '#6aebbc',
          400: '#2fd8a0',
          500: '#0abf89',
          600: '#009b70',
          DEFAULT: '#008060',
          800: '#03624a',
          900: '#04503f',
          950: '#012d25',
        },
      },
    },
  },
  plugins: [],
}
