import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E2C07A',
          dark: '#A0752E',
        },
        navy: {
          DEFAULT: '#0F0F1A',
          dark: '#0A0A0F',
          light: '#1A1A2E',
        },
        cream: {
          DEFAULT: '#F5EFD6',
          muted: '#D4C9A8',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        garamond: ['"EB Garamond"', 'serif'],
      },
      animation: {
        twinkle: 'twinkle 3s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(201,168,76,0.3), 0 0 10px rgba(201,168,76,0.1)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(201,168,76,0.8), 0 0 40px rgba(201,168,76,0.4)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C, #E2C07A, #C9A84C)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0F, #0F0F1A)',
      },
    },
  },
  plugins: [],
}

export default config
