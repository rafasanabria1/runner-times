/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      screens: {
        desktop: '768px'
      }
    }
  },
  plugins: [
    require("daisyui")
  ],
  daisyui: {
    themes: ["synthwave"],
  }
}
