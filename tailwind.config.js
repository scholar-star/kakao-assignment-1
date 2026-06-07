/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // JSX 컴포넌트들을 감시하도록 설정
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}