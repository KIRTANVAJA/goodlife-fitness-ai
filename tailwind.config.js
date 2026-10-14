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
        // Luxury Performance Global Color System
        obsidian: {
          DEFAULT: '#171916',
          dark: '#0F100E',
          surface: '#1E211D',
          hover: '#262924',
        },
        forest: {
          DEFAULT: '#173F35',
          dark: '#102B24',
          light: '#1F5144',
          muted: '#173F351A',
        },
        emerald: {
          DEFAULT: '#26745A',
          dark: '#1D5A46',
          light: '#338F70',
          soft: '#EAF4F0',
        },
        gold: {
          DEFAULT: '#C6A66B',
          light: '#D8BF8F',
          dark: '#A48449',
          muted: '#C6A66B26',
        },
        ivory: {
          DEFAULT: '#F5F1E8',
          light: '#FAF8F3',
          dark: '#EAE5D9',
        },
        purewhite: '#FFFFFF',
        stone: {
          DEFAULT: '#85877F',
          light: '#A8AAA3',
          dark: '#5A5C55',
          muted: '#85877F40',
        },
        'border-luxury': '#E5E1D7',

        // Backward compatibility mappings
        luxury: {
          bg: '#F5F1E8',
          card: '#FFFFFF',
          text: '#171916',
          secondary: '#85877F',
          primary: '#173F35',
          emerald: '#26745A',
          accent: '#C6A66B',
          border: '#E5E1D7',
          hover: '#EDE9DE',
          surface: '#FAF8F3',
          obsidian: '#171916',
        },
        gym: {
          black: '#171916',
          dark: '#171916',
          card: '#FFFFFF',
          cardHover: '#FAF8F3',
          border: '#E5E1D7',
          borderGold: '#C6A66B',
          borderSilver: '#E5E1D7',
          gold: {
            light: '#D8BF8F',
            DEFAULT: '#C6A66B',
            dark: '#A48449',
            deep: '#8C6E38',
            accent: '#C6A66B',
          },
          silver: {
            light: '#FAF8F3',
            DEFAULT: '#85877F',
            dark: '#5A5C55',
            deep: '#171916',
            accent: '#FFFFFF',
          },
          grey: {
            muted: '#85877F',
            secondary: '#5A5C55',
            light: '#E5E1D7',
          }
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif'],
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



