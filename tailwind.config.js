/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  mode: 'jit',

  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        'auto-box': 'repeat(autofill, 100px)',

      }
    }
  },
  plugins: [],
}
