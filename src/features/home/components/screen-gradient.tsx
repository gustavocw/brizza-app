import { StyleSheet, useWindowDimensions } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import { useColors } from '@/theme/use-colors'

/** Diagonal test gradient behind the Home screen (top-left → bottom-right). */
export function ScreenGradient() {
  const colors = useColors()
  const { width, height } = useWindowDimensions()

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id="homeGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={colors.gradientTop} />
          <Stop offset="1" stopColor={colors.gradientBottom} />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill="url(#homeGradient)" />
    </Svg>
  )
}
