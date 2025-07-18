/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        encode: ['"Encode Sans Expanded"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

