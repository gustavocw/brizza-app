/** @type {import('tailwindcss').Config} */
// Colors/radii/fonts come from the SINGLE source: src/theme/tokens.js
const { colors, radius, fonts } = require('./src/theme/tokens')

module.exports = {
  content: ['./app/**/*.{ts,tsx,js,jsx}', './src/**/*.{ts,tsx,js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      borderRadius: {
        sm: `${radius.sm}px`,
        md: `${radius.md}px`,
        lg: `${radius.lg}px`,
        xl: `${radius.xl}px`,
        '2xl': `${radius['2xl']}px`,
        '3xl': `${radius['3xl']}px`,
      },
      fontFamily: {
        sans: [fonts.sans, 'system-ui'],
        medium: [fonts.medium],
        semibold: [fonts.semibold],
        bold: [fonts.bold],
        mono: [fonts.mono, 'monospace'],
        'mono-medium': [fonts.monoMedium, 'monospace'],
      },
    },
  },
  plugins: [],
}
