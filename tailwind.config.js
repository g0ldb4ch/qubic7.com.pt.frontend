/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'severity-critical': '#dc2626',
        'severity-high': '#ea580c',
        'severity-medium': '#f59e0b',
        'severity-low': '#84cc16',
        'severity-info': '#3b82f6',
      }
    },
  },
  plugins: [],
}