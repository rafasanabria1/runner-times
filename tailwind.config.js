/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        light: '#86BBD8',
        dark: '#33658A',
        darker: '#2F4858',
        secondary: '#F6AE2D',
        tertiary: '#F26419' 
      }
    }
  },
  plugins: [],
}
