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
          bg: '#0A1128',
          card: 'rgba(18, 32, 72, 0.72)',
          accent: '#3B82F6',
          blue: '#0EA5E9',
          glow: 'rgba(59, 130, 246, 0.28)',
        },
        violet: {
          300: '#bfdbfe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        blue: {
          300: '#bae6fd',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#24365f',
          800: '#152452',
          900: '#0d1b3e',
          950: '#0a1128',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px rgba(59, 130, 246, 0.35)',
        'glow-blue': '0 0 25px rgba(14, 165, 233, 0.35)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.45)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-1.5deg)' },
        },
        floatSlower: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.08)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out',
        scaleIn: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        slideUp: 'slideUp 0.3s ease-out',
        'float-slow': 'floatSlow 5s ease-in-out infinite',
        'float-reverse': 'floatReverse 6.5s ease-in-out infinite',
        'float-slower': 'floatSlower 8s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
