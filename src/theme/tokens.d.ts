// Type surface for tokens.js so the app gets full autocomplete without `allowJs`.

export type ColorToken =
  | 'background'
  | 'surface'
  | 'surfaceMuted'
  | 'foreground'
  | 'muted'
  | 'subtle'
  | 'border'
  | 'divider'
  | 'primary'
  | 'primaryDark'
  | 'primarySoft'
  | 'onPrimary'
  | 'brandNight'
  | 'accent'
  | 'onAccent'
  | 'success'
  | 'successSoft'
  | 'warning'
  | 'warningSoft'
  | 'error'
  | 'errorSoft'
  | 'info'
  | 'infoSoft'
  | 'overlay'
  | 'disabled'

export type ColorMap = Record<ColorToken, string>
export type RadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

export const palette: Record<string, string>
export const colors: ColorMap
export const colorsDark: ColorMap
export const radius: Record<RadiusToken, number>
export const fonts: {
  sans: string
  medium: string
  semibold: string
  bold: string
  mono: string
  monoMedium: string
}
