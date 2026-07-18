import type { ViewStyle } from 'react-native'
import { colors } from '@/theme/tokens'

/** Soft shadow — used by dark cards (e.g. the Home battery card). */
export const CARD_SHADOW: ViewStyle = {
  boxShadow: 'rgba(50, 50, 93, 0.1) 0px 6px 12px -2px, rgba(0, 0, 0, 0.14) 0px 3px 7px -3px',
}

/** Hairline border used by white cards app-wide (in place of a shadow). */
export const CARD_BORDER: ViewStyle = {
  borderColor: colors.cardBorder,
  borderWidth: 2,
}
