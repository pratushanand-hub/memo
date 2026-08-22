/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#030712', // deep navy/black background
          card: 'rgba(17, 24, 39, 0.7)', // glassmorphism card background
          accent: '#8b5cf6', // purple AI accent
          blue: '#3b82f6', // blue accent
          glow: 'rgba(139, 92, 246, 0.15)', // purple glow
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.25)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.25)',
      }
    },
  },
  plugins: [],
}
