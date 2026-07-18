import type { ViewStyle } from 'react-native'

/** Soft shadow — used by the dark battery card. */
export const CARD_SHADOW: ViewStyle = {
  boxShadow: 'rgba(50, 50, 93, 0.1) 0px 6px 12px -2px, rgba(0, 0, 0, 0.14) 0px 3px 7px -3px',
}

/** Hairline border used by the white cards (in place of a shadow). */
export const CARD_BORDER: ViewStyle = {
  borderColor: '#F1F1F1',
  borderWidth: 2,
}
