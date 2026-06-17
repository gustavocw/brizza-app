// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for design tokens — Brizze.
//
// This file is plain CommonJS on purpose: it is consumed BOTH by
//   - tailwind.config.js  (Node, via require) → powers NativeWind classes
//   - src/theme/theme.ts   (the app, via import) → powers StyleSheet / inline styles
//
// Change a value HERE and it updates everywhere. Never hardcode a hex in a
// component. To rebrand, edit `palette.brand` + the semantic maps below.
//
// Types live in tokens.d.ts (kept next to this file).
// ─────────────────────────────────────────────────────────────────────────────

// Raw palette — the only place literal colors are allowed.
const palette = {
  // Brand — Brizze green.
  brand: '#1E6B41', // green-600 — verde primário
  brandDark: '#1A5235', // green-700
  brandSoft: '#EDFAF3', // green-50 — verde claro

  // Full green scale (electric mobility identity).
  green900: '#0D2B1F', // verde noite
  green800: '#153D2B',
  green700: '#1A5235',
  green600: '#1E6B41',
  green500: '#2A8A52',
  green400: '#3AAD68', // verde ação
  green300: '#5EC885',
  green200: '#96DCAD',
  green100: '#D0F0DC',
  green50: '#EDFAF3',

  // Neutrals.
  ink: '#1A1A18', // texto
  gray900: '#1A1A18',
  gray600: '#5C5B57',
  gray400: '#9E9D99',
  gray200: '#DDDCDA',
  gray100: '#EEEEED',
  gray50: '#F7F8F6', // background
  white: '#FFFFFF',

  // Feedback.
  amber: '#F5A623', // alerta
  amberSoft: '#FFF4D9',
  red: '#E53935',
  redSoft: '#FDECEA',
  blue: '#4285F4', // map
  blueSoft: '#E7F0FE',
}

// Semantic tokens — what components actually reference (bg-background, text-foreground…).
// LIGHT scheme is the default that ships into Tailwind.
const colors = {
  background: palette.gray50, // page background
  surface: palette.white, // cards, sheets, inputs
  surfaceMuted: palette.gray100, // secondary surfaces, ghost buttons

  foreground: palette.ink, // primary text
  muted: palette.gray600, // secondary text
  subtle: palette.gray400, // metadata, placeholders, disabled text

  border: palette.gray200,
  divider: palette.gray100,

  primary: palette.brand,
  primaryDark: palette.brandDark,
  primarySoft: palette.brandSoft,
  onPrimary: palette.white, // text/icon on primary surfaces
  brandNight: palette.green900, // deep brand surface (hero / premium dark cards)

  accent: palette.green400, // verde ação
  onAccent: palette.white,

  success: palette.green500,
  successSoft: palette.green100,
  warning: palette.amber,
  warningSoft: palette.amberSoft,
  error: palette.red,
  errorSoft: palette.redSoft,
  info: palette.blue,
  infoSoft: palette.blueSoft,

  overlay: 'rgba(13, 43, 31, 0.45)', // green-900 tint behind sheets/dialogs
  disabled: palette.gray200,
}

// DARK scheme — same keys, dark-green values. Consumed by JS via useColors().
// UI ships light-only for now (see app.config userInterfaceStyle); this keeps
// the JS palette coherent for when dark mode is turned on.
const colorsDark = {
  background: '#081711',
  surface: palette.green900,
  surfaceMuted: palette.green800,

  foreground: palette.green50,
  muted: palette.green200,
  subtle: '#7FA890',

  border: palette.green700,
  divider: palette.green800,

  primary: palette.green400,
  primaryDark: palette.green500,
  primarySoft: '#0F3322',
  onPrimary: '#06140D',
  brandNight: palette.green900, // deep brand surface (hero / premium dark cards)

  accent: palette.green300,
  onAccent: '#06140D',

  success: palette.green400,
  successSoft: '#0F3322',
  warning: palette.amber,
  warningSoft: '#2E2410',
  error: '#FF6B68',
  errorSoft: '#2E1414',
  info: palette.blue,
  infoSoft: '#102A4E',

  overlay: 'rgba(0, 0, 0, 0.6)',
  disabled: palette.green700,
}

// Radii follow the blueprint (sm 8 / md 14 / lg 20).
const radius = {
  none: 0,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  full: 9999,
}

// DM Sans (interface) + DM Mono (labels/data). Loaded in app/_layout via
// @expo-google-fonts/dm-sans and @expo-google-fonts/dm-mono.
const fonts = {
  sans: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semibold: 'DMSans_600SemiBold',
  bold: 'DMSans_700Bold',
  mono: 'DMMono_400Regular',
  monoMedium: 'DMMono_500Medium',
}

module.exports = { palette, colors, colorsDark, radius, fonts }
