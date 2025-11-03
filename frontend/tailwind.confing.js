/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can define custom colors here if you want to use semantic names
        // primary: '#7c3aed',
        // secondary: '#3b82f6',
        // background: '#0f172a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Add Inter or your preferred font
      },
    },
  },
  plugins: [require("daisyui")],
}