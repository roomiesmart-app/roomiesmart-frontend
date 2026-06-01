/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#B95D46',
        secondary: '#1E293B',
        tertiary: '#008779',
        neutral: '#827471',
      },
      fontFamily: {
        // Configuramos Manrope como la fuente principal por defecto
        sans: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}