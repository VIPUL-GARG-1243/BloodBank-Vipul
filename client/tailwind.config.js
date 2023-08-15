/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#6528F7",
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
