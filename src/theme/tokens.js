// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for design tokens — Brizze.
//
// This file is plain CommonJS on purpose: it is consumed BOTH by
//   - tailwind.config.js  (Node, via require) → powers NativeWind classes
//   - src/theme/theme.ts   (the app, via import) → powers StyleSheet / inline styles
//
// Change a value HERE and it updates everywhere. Never hardcode a hex in a
// component. To rebrand, edit `palette` + the semantic maps below.
//
// Palette from the official brand book (Branding book - Brizze): green #006138
// (Pantone 349 C) is the PRIMARY, navy #002856 (Pantone 282 C) is the support
// color for dark surfaces, gray #848484 (Cool Gray 8 C) and black are secondary.
//
// Types live in tokens.d.ts (kept next to this file).
// ─────────────────────────────────────────────────────────────────────────────

// Raw palette — the only place literal colors are allowed.
const palette = {
  // Brand — Brizze green (primary) + navy (support). Official hexes.
  brand: '#006138', // verde primário — Pantone 349 C
  brandDark: '#00502F', // green-700 (pressed/hover)
  brandSoft: '#E7F3EC', // green-50 — verde clarinho

  // Full green scale, anchored at 600 = #006138 (electric mobility identity).
  green900: '#002316', // verde noite
  forest: '#0F3D2C', // verde-floresta — superfície escura verde (card de bateria)
  green800: '#003A22',
  green700: '#00502F',
  green600: '#006138', // primário
  green500: '#0B7A46',
  green400: '#1F9A5C', // verde ação (accent — energia)
  green300: '#5BB183',
  green200: '#97CDAF',
  green100: '#C6E3D2',
  green50: '#E7F3EC',

  // Navy scale — support color / dark surfaces. Anchored at 700 = #002856.
  navy900: '#00112B',
  navy800: '#001B3D',
  navy700: '#002856', // azul-marinho oficial — Pantone 282 C
  navy600: '#103C6E',
  navy500: '#1E4E86',
  navy100: '#C9D5E4',
  navy50: '#EAEFF5',

  // Neutrals. gray400 = the brand's secondary gray (#848484, Cool Gray 8 C).
  ink: '#0F1417', // texto (quase preto)
  gray900: '#0F1417',
  gray600: '#5B6168',
  gray400: '#848484', // cinza secundário oficial
  gray200: '#D9DCDD',
  gray150: '#F1F1F1', // hairline dos cards (escolhida no design da Home)
  gray100: '#EDEEEF',
  gray50: '#F6F7F8', // background
  white: '#FFFFFF',

  // Teste — gradiente diagonal de fundo (Home).
  gradientTop: '#F5F9F7',
  gradientBottom: '#F6F6F8',

  // Feedback.
  amber: '#F5A623', // alerta
  amberSoft: '#FFF4D9',
  red: '#E53935',
  redSoft: '#FDECEA',
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
  cardBorder: palette.gray150, // borda 2px dos cards brancos (no lugar de sombra)

  primary: palette.brand, // #006138
  primaryDark: palette.brandDark,
  primarySoft: palette.brandSoft,
  onPrimary: palette.white, // text/icon on primary surfaces
  brandNight: palette.navy700, // deep brand surface (hero / premium dark cards) — NAVY

  // Verde-floresta — superfície escura verde (card de bateria estilo referência).
  brandForest: palette.forest,
  onForest: palette.white, // texto/% sobre o card verde-escuro
  onForestLine: 'rgba(198,227,210,0.5)', // moldura + terminal do gauge (green100 esmaecido)
  onForestTrack: 'rgba(198,227,210,0.16)', // barras vazias do gauge

  accent: palette.green400, // verde ação (energia)
  onAccent: palette.white,

  // Azul-marinho de apoio — dados / utilitário (telemetria, menus, ficha técnica).
  secondary: palette.navy700,
  secondarySoft: palette.navy50,
  onSecondary: palette.white,

  success: palette.green500,
  successSoft: palette.green100,
  warning: palette.amber,
  warningSoft: palette.amberSoft,
  onWarning: palette.ink, // texto/ícone sobre superfícies âmbar (branco reprova contraste)
  error: palette.red,
  errorSoft: palette.redSoft,
  info: palette.navy700, // azul-marinho
  infoSoft: palette.navy50,

  overlay: 'rgba(0, 40, 86, 0.45)', // navy tint behind sheets/dialogs
  disabled: palette.gray200,

  gradientTop: palette.gradientTop, // teste — fundo Home
  gradientBottom: palette.gradientBottom,
}

// DARK scheme — same keys, navy-based values. Consumed by JS via useColors().
// UI ships light-only for now (see app.config userInterfaceStyle); this keeps
// the JS palette coherent for when dark mode is turned on.
const colorsDark = {
  background: palette.navy900,
  surface: palette.navy800,
  surfaceMuted: '#0A2547',

  foreground: palette.navy50,
  muted: palette.navy100,
  subtle: '#7E93AD',

  border: '#12345E',
  divider: '#0A2547',
  cardBorder: '#12345E',

  primary: palette.green400,
  primaryDark: palette.green500,
  primarySoft: '#062A1A',
  onPrimary: '#00160D',
  brandNight: palette.navy700,

  brandForest: palette.forest,
  onForest: palette.white,
  onForestLine: 'rgba(198,227,210,0.5)',
  onForestTrack: 'rgba(198,227,210,0.16)',

  accent: palette.green300,
  onAccent: '#00160D',

  secondary: palette.navy500,
  secondarySoft: '#0A2547',
  onSecondary: palette.navy50,

  success: palette.green400,
  successSoft: '#062A1A',
  warning: palette.amber,
  warningSoft: '#2E2410',
  onWarning: palette.ink,
  error: '#FF6B68',
  errorSoft: '#2E1414',
  info: palette.navy500,
  infoSoft: '#0A2547',

  overlay: 'rgba(0, 0, 0, 0.6)',
  disabled: '#12345E',

  gradientTop: palette.gradientTop,
  gradientBottom: palette.gradientBottom,
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

// Montserrat — the brand book's official typeface. Loaded in app/_layout via
// @expo-google-fonts/montserrat. The brand has no monospace face, so the "mono"
// role maps to Montserrat too: labels keep their uppercase/tracked treatment
// (via className), just rendered in Montserrat instead of a monospace font.
const fonts = {
  sans: 'Montserrat_400Regular',
  medium: 'Montserrat_500Medium',
  semibold: 'Montserrat_600SemiBold',
  bold: 'Montserrat_700Bold',
  mono: 'Montserrat_400Regular',
  monoMedium: 'Montserrat_500Medium',
}

module.exports = { palette, colors, colorsDark, radius, fonts }
