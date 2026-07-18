import type { ViewStyle } from 'react-native'
import { colors } from '@/theme/tokens'

/** Hairline border used by every card app-wide (in place of a shadow). */
export const CARD_BORDER: ViewStyle = {
  borderColor: colors.cardBorder,
  borderWidth: 2,
}
