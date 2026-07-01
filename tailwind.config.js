/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        flux: {
          bg: '#0a0e14',
          surface: '#121820',
          card: '#1a2230',
          border: '#2a3548',
          accent: '#00d4aa',
          'accent-dim': '#00a888',
          warm: '#ff6b4a',
          cool: '#4a9eff',
          sodium: '#f5c542',
          carb: '#ff8c42',
          muted: '#6b7a90',
          text: '#e8edf5',
          'text-dim': '#9aa8bc',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['DM Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(0, 212, 170, 0.15)',
        card: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
