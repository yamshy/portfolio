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
      // Colors are defined in @theme directive in global.css
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'grow': 'grow 0.6s ease-out',
        'morph': 'morph 8s ease-in-out infinite',
        'draw-line': 'drawLine 1.5s ease-out',
        'organic-float': 'organicFloat 4s ease-in-out infinite',
        'cell-float': 'cellFloat 6s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite',
        'cell-breathe': 'cellBreathe 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
        'bounce': 'bounce 1s infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
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
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'none', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        cellFloat: {
          '0%, 100%': { 
            borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%',
            transform: 'translateY(0px) rotate(0deg)'
          },
          '25%': { 
            borderRadius: '45% 55% 55% 45% / 50% 50% 50% 50%',
            transform: 'translateY(-1px) rotate(0.5deg)'
          },
          '50%': { 
            borderRadius: '55% 45% 45% 55% / 45% 55% 55% 45%',
            transform: 'translateY(1px) rotate(-0.3deg)'
          },
          '75%': { 
            borderRadius: '45% 55% 55% 45% / 55% 55% 45% 45%',
            transform: 'translateY(-1px) rotate(0.2deg)'
          }
        },
        cellBreathe: {
          '0%': { 
            transform: 'scale(1)',
            borderRadius: '50% 50% 50% 50% / 55% 55% 45% 45%'
          },
          '50%': { 
            transform: 'scale(1.08)',
            borderRadius: '40% 60% 60% 40% / 45% 55% 55% 45%'
          },
          '100%': { 
            transform: 'scale(1.03)',
            borderRadius: '52% 48% 48% 52% / 50% 50% 50% 50%'
          }
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
      // Custom spacing for organic shapes
      spacing: {
        'organic': '60% 40% 30% 70% / 60% 30% 70% 40%',
      },
      // Enhanced shadow utilities
      boxShadow: {
        'organic': '0 4px 20px rgb(from var(--color-mocha-mousse) r g b / 0.15), 0 2px 8px rgb(from var(--color-mocha-mousse) r g b / 0.1)',
        'organic-lg': '0 8px 40px rgb(from var(--color-mocha-mousse) r g b / 0.2), 0 4px 16px rgb(from var(--color-mocha-mousse) r g b / 0.15)',
      },
      // Text shadow utilities
      textShadow: {
        'sm': '0 1px 2px rgb(0 0 0 / 0.05)',
        'md': '0 2px 4px rgb(0 0 0 / 0.1)',
        'lg': '0 4px 8px rgb(0 0 0 / 0.15)',
        'organic': '0 2px 4px rgb(from var(--color-mocha-mousse) r g b / 0.2)',
      },
    },
  },
  plugins: [
    // Custom plugin for organic shape utilities
    function({ addUtilities }) {
      addUtilities({
        '.organic-blob': {
          'border-radius': '60% 40% 30% 70% / 60% 30% 70% 40%',
          'animation': 'morph 7s ease-in-out infinite',
        },
        '.organic-blob-2': {
          'border-radius': '30% 70% 70% 30% / 30% 30% 70% 70%',
          'animation': 'morph 7s ease-in-out infinite reverse',
        },
        '.organic-blob-3': {
          'border-radius': '50% 30% 50% 70% / 40% 60% 40% 60%',
          'animation': 'morph 7s ease-in-out infinite',
          'animation-delay': '-3.5s',
        },
      });
    },
    // Text shadow plugin
    function({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    },
  ],
}
