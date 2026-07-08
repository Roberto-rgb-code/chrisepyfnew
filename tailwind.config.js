/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#df2f36',
          'red-dark': '#b8232a',
          'red-light': '#fde8e9',
          black: '#000000',
        },
      },
    },
  },
  plugins: [],
}

