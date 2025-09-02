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
        // Colors
        'mocha': {
          50: '#f7f4f2',
          100: '#ede6e1',
          200: '#d9ccc2',
          300: '#c2b0a3',
          400: '#a47864', // Pantone Color of the Year: Mocha Mousse
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
          400: '#e2725b', // Terracotta red
          500: '#d45a42',
          600: '#b84a35',
          700: '#9a3d2d',
          800: '#7c3226',
          900: '#5e271f',
        },
        'honey': {
          50: '#fefdf8',
          100: '#fdf9ed',
          200: '#faf1d3',
          300: '#f6e6b1',
          400: '#f0d485',
          500: '#e8c05a',
          600: '#d4a842',
          700: '#b89035',
          800: '#9c782d',
          900: '#806125',
        },
        'digital-lavender': {
          50: '#f7f4ff',
          100: '#ede6ff',
          200: '#ddd1ff',
          300: '#c7b3ff',
          400: '#a78bfa', // Digital lavender
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        'neon-yellow': {
          50: '#fffbeb',
          100: '#fff7d1',
          200: '#ffed9a',
          300: '#ffdd44', // Neon yellow accent
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
        },
        'warm-green': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
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
      },

    },
  },
  plugins: [],
}
