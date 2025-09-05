/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          300: 'oklch(87.1% .15 154.449)',
          400: 'oklch(79.2% .209 151.711)',
          500: 'oklch(72.3% .219 149.579)',
          600: 'oklch(62.7% .194 149.214)',
          700: 'oklch(52.7% .154 150.069)',
        },
        cyan: {
          300: 'oklch(86.5% .127 207.078)',
          500: 'oklch(71.5% .143 215.221)',
          600: 'oklch(60.9% .126 221.723)',
        },
        sky: {
          100: 'oklch(95.1% .026 236.824)',
          400: 'oklch(74.6% .16 232.661)',
          500: 'oklch(68.5% .169 237.323)',
          600: 'oklch(58.8% .158 241.966)',
        },
        blue: {
          500: 'oklch(62.3% .214 259.815)',
          600: 'oklch(54.6% .245 262.881)',
          900: 'oklch(37.9% .146 265.522)',
        },
        slate: {
          100: 'oklch(96.8% .007 247.896)',
          200: 'oklch(92.9% .013 255.508)',
          300: 'oklch(86.9% .022 252.894)',
          400: 'oklch(70.4% .04 256.788)',
          500: 'oklch(55.4% .046 257.417)',
          600: 'oklch(44.6% .043 257.281)',
          700: 'oklch(37.2% .044 257.287)',
          900: 'oklch(20.8% .042 265.755)',
        },
        neutral: {
          200: 'oklch(92.2% 0 0)',
        },
        white: '#fff',
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'pulse-gentle': 'pulse-gentle 2s infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'pulse-gentle': {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.02)',
          },
        },
        'shimmer': {
          '0%': {
            left: '-100%',
          },
          '100%': {
            left: '100%',
          },
        },
      },
    },
  },
  plugins: [],
}
