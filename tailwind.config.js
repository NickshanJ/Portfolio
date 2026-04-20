/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
        'trade-winds': ['"Trade Winds"', 'cursive'],
        stylish: ['Stylish', 'sans-serif'],
      },
      colors: {
        cyan: '#00D4FF',
      },
    },
  },
  plugins: [],
};