import { Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Android 3-button (virtual) nav leaves a TALL bottom inset (~48dp); the gesture
// pill is slim (~16–24dp). We use that gap to tell them apart so floating UI can
// lift clear of the buttons without over-lifting on gesture nav. Heuristic —
// manufacturers vary — so the threshold sits comfortably between the two. iOS
// (home indicator) is never "nav buttons".
const NAV_BUTTONS_MIN_INSET = 40

/** True on Android when the on-screen 3-button nav bar is present (not gesture nav). */
export function useHasNavButtons() {
  const insets = useSafeAreaInsets()
  return Platform.OS === 'android' && insets.bottom >= NAV_BUTTONS_MIN_INSET
}
