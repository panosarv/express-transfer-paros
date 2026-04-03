/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'etp-dark': '#232436',
        'etp-gold': '#d9b16b',
        'etp-gold-dark': '#B4952E',
        'etp-cream': '#FFF8ED',
        'etp-charcoal': '#1C1C1C',
        'etp-gray': '#2C2C2C',
      },
      fontFamily: {
        'heading': ['"Old Standard TT"', 'serif'],
        'body': ['system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'jiggle': 'carJiggle 0.12s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        carJiggle: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '20%': { transform: 'translate(0.5px, 0.8px) rotate(0.08deg)' },
          '40%': { transform: 'translate(-0.3px, 0.5px) rotate(-0.05deg)' },
          '60%': { transform: 'translate(0.4px, -0.3px) rotate(0.04deg)' },
          '80%': { transform: 'translate(-0.2px, 0.4px) rotate(-0.03deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-subtle': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(217, 177, 107, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(217, 177, 107, 0)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
