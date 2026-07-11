/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          black: '#080808', // Matte black
          dark: '#121212',
          card: '#1A1A1E',
          cardHover: '#222227',
          border: '#2A2A30',
          borderGold: '#E5C07B',
          borderSilver: '#D1D5DB',
          gold: {
            light: '#F5E3B5',
            DEFAULT: '#D4AF37', // Classic metallic gold
            dark: '#AA7C11',
            deep: '#835F0C',
            accent: '#FFD700', // Bright gold
          },
          silver: {
            light: '#F3F4F6',
            DEFAULT: '#C0C0C0', // Classic metallic silver
            dark: '#9CA3AF',
            deep: '#4B5563',
            accent: '#FFFFFF', // White chrome highlights
          },
          grey: {
            muted: 'var(--text-muted, #8E8E93)',
            secondary: 'var(--text-secondary, #4A4A4F)',
            light: '#E5E5EA',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 5s ease-in-out infinite',
        'float': 'float 7s ease-in-out infinite',
        'scroll-down': 'scroll-down 2.2s infinite',
        'fade-in': 'fade-in 1s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slide-up': 'slide-up 1s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'reveal': 'reveal 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: 0.12, transform: 'scale(1)' },
          '50%': { opacity: 0.22, transform: 'scale(1.03)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'scroll-down': {
          '0%': { transform: 'translateY(0)', opacity: 0 },
          '50%': { opacity: 1 },
          '100%': { transform: 'translateY(8px)', opacity: 0 },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(15px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'reveal': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      backgroundImage: {
        'gold-metallic-gradient': 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA7C11 100%)',
        'silver-metallic-gradient': 'linear-gradient(135deg, #9CA3AF 0%, #E5E7EB 25%, #C0C0C0 50%, #F3F4F6 75%, #4B5563 100%)',
        'gold-dark-gradient': 'linear-gradient(180deg, rgba(212, 175, 55, 0.1) 0%, rgba(8, 8, 8, 0) 100%)',
        'silver-dark-gradient': 'linear-gradient(180deg, rgba(192, 192, 192, 0.1) 0%, rgba(8, 8, 8, 0) 100%)',
        'day-radial-spotlight': 'radial-gradient(circle at center, rgba(212, 175, 55, 0.04) 0%, rgba(250, 250, 250, 0) 70%)',
        'night-radial-spotlight': 'radial-gradient(circle at center, rgba(192, 192, 192, 0.05) 0%, rgba(8, 8, 8, 0) 70%)',
        'card-gradient-dark': 'linear-gradient(145deg, #1A1A1E 0%, #121212 100%)',
        'card-gradient-light': 'linear-gradient(145deg, #FFFFFF 0%, #F5F5F7 100%)',
      }
    },
  },
  plugins: [],
}



