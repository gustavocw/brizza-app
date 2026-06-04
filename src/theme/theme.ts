// Typed JS-side theme. Use this for StyleSheet, inline styles, icon `color`
// props, and anywhere NativeWind classes don't reach.
//
// Prefer NativeWind classes (className="bg-primary") for layout/styling.
// Reach for these tokens only when you need a raw value in JS.

import { Platform } from 'react-native'
import { colors, colorsDark, radius, fonts, type ColorMap } from './tokens'

/** Light palette as a typed object (default). */
export const colorTheme: ColorMap = colors

/** Dark palette (consumed by useColors based on the active scheme). */
export const colorThemeDark: ColorMap = colorsDark

export const radiusTheme = radius

/**
 * Font family stack. DM Sans for the interface, DM Mono for labels/data, shipped
 * everywhere for cross-platform parity. `Platform.select` lets you fall back to
 * the system font if a weight failed to load.
 */
export const fontTheme = {
  sans: Platform.select({ default: fonts.sans }),
  medium: Platform.select({ default: fonts.medium }),
  semibold: Platform.select({ default: fonts.semibold }),
  bold: Platform.select({ default: fonts.bold }),
  mono: Platform.select({ default: fonts.mono }),
  monoMedium: Platform.select({ default: fonts.monoMedium }),
}

/**
 * Four-tier shadow scale. iOS uses shadow* props, Android uses elevation.
 * Apply as a `style={shadowsTheme.md}`.
 */
export const shadowsTheme = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 10,
  },
  xl: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 34,
    elevation: 18,
  },
} as const
