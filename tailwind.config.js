/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors:{
        'primaryYellow':'#f2c302',
        'secundaryYellow':'#F0C81F',
        'neutralGray':'#C7C8CD',
        'hoverGray':'#bdbdbd'
      }
    },
  },
  plugins: [],
}

