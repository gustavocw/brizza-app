import { useColorScheme } from 'react-native'
import { colorTheme, colorThemeDark } from './theme'
import type { ColorMap } from './tokens'

/**
 * Scheme-aware color access for the JS side (StyleSheet / inline / icon colors).
 *
 *   const c = useColors()
 *   <Icon color={c.foreground} />
 *   style={{ backgroundColor: c.surface }}
 *
 * NativeWind classes handle dark mode separately (see references/theme.md).
 * Out of the box the app is light; this hook is what makes JS styles follow the
 * device scheme the moment you opt into dark.
 */
export function useColors(): ColorMap {
  const scheme = useColorScheme()
  return scheme === 'dark' ? colorThemeDark : colorTheme
}
