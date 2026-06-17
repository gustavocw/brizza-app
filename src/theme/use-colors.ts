import { colorTheme } from './theme'
import type { ColorMap } from './tokens'

/**
 * Color access for the JS side (StyleSheet / inline / icon colors).
 *
 *   const c = useColors()
 *   <Icon color={c.foreground} />
 *   style={{ backgroundColor: c.surface }}
 *
 * The app ships light-only (`userInterfaceStyle: 'light'`, and NativeWind has no
 * dark variants), so this ALWAYS returns the light palette. Following the device
 * scheme here desyncs JS colors from the light-only className styles — e.g. on
 * Android in dark mode it made input text/placeholder near-white on a white
 * surface (invisible). Re-introduce a dark branch only alongside dark NativeWind tokens.
 */
export function useColors(): ColorMap {
  return colorTheme
}
