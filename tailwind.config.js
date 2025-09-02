/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'rst-thermal': ['RST Thermal', 'sans-serif'],
        'sans': ['RST Thermal', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'bold': '700',
      },
      colors: {
        // High-contrast warm palette with strategic bright accents
        'warm-white': '#FEFCF8',
        'coral-primary': '#E85A2B',
        'text-dark': '#1A0D08',
        'accent-yellow': '#FFD644',
        'mocha-mousse': '#A47864',
        'cool-contrast': '#2563EB',
        
        // Glassmorphism colors
        'glass-coral': 'rgba(232, 90, 43, 0.2)',
        'glass-mocha': 'rgba(164, 120, 100, 0.15)',
        'glass-yellow': 'rgba(255, 214, 68, 0.15)',
        'glass-blue': 'rgba(37, 99, 235, 0.1)',
        'glass-dark': 'rgba(26, 13, 8, 0.1)',
        
        // Legacy colors for compatibility
        'mocha': {
          50: '#f7f4f2',
          100: '#ede6e1',
          200: '#d9ccc2',
          300: '#c2b0a3',
          400: '#a47864',
          500: '#8f6b5a',
          600: '#7a5a4c',
          700: '#654a3f',
          800: '#503c33',
          900: '#3b2e27',
        },
        'terracotta': {
          50: '#fdf4f2',
          100: '#fbe8e4',
          200: '#f6d1c9',
          300: '#eeb3a6',
          400: '#e2725b',
          500: '#d45a42',
          600: '#b84a35',
          700: '#9a3d2d',
          800: '#7c3226',
          900: '#5e271f',
        },
        'neon-yellow': {
          50: '#fffbeb',
          100: '#fff7d1',
          200: '#ffed9a',
          300: '#ffdd44',
          400: '#f5c842',
          500: '#e6b73a',
          600: '#d4a632',
          700: '#c2952a',
          800: '#b08422',
          900: '#9e731a',
        },
        'warm-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'grow': 'grow 0.6s ease-out',
        'morph': 'morph 8s ease-in-out infinite',
        'draw-line': 'drawLine 1.5s ease-out',
        'organic-float': 'organicFloat 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        grow: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '25%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
          '50%': { borderRadius: '50% 30% 60% 40% / 30% 50% 60% 70%' },
          '75%': { borderRadius: '40% 70% 50% 60% / 70% 40% 50% 30%' },
        },
        drawLine: {
          '0%': { strokeDashoffset: '100%' },
          '100%': { strokeDashoffset: '0%' },
        },
        organicFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(1deg)' },
          '66%': { transform: 'translateY(4px) rotate(-0.5deg)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
      },

    },
  },
  plugins: [],
}
