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
        'ecoindex-red': {
          50: '#fff0f3',
          100: '#ffe1e8',
          200: '#ffc8d7',
          300: '#ff9bb6',
          400: '#ff6391',
          500: '#ff2c70',
          600: '#f6085d',
          DEFAULT: '#dd0055',
          800: '#ae034a',
          900: '#940746',
          950: '#530022',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
