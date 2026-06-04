import { Dimensions } from 'react-native'

const screen = Dimensions.get('screen')

export const dimensions = { width: screen.width, height: screen.height }

/** Screen width minus the standard 16px horizontal padding on each side. */
export const contentWidth = screen.width - 32

export const isSmallScreen = screen.width < 360
export const isTablet = screen.width >= 768
