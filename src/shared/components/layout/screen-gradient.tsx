import { StyleSheet, useWindowDimensions } from 'react-native'
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg'
import { useColors } from '@/theme/use-colors'

/** App background gradient — vertical 3-stop: white top → the usual top tint →
 *  bottom tint. Rendered behind the Screen when `gradient` is set; covers the full
 *  window, including the status bar. `topColor` overrides the white top; `topHoldPx`
 *  holds white solid until that many px down (e.g. measured to the bottom of the
 *  photo banner) before the usual tints take over — otherwise just ~16px. */
export function ScreenGradient({ topColor, topHoldPx }: { topColor?: string; topHoldPx?: number }) {
  const colors = useColors()
  const { width, height } = useWindowDimensions()

  const top = topColor ?? colors.surface
  const hold = topHoldPx && height ? Math.min(0.9, topHoldPx / height) : 16 / Math.max(height, 1)
  const midAt = Math.min(0.98, Math.max(0.28, hold + 0.1))

  const stops = [
    { offset: '0', color: top },
    { offset: `${hold}`, color: top },
    { offset: `${midAt}`, color: colors.gradientTop },
    { offset: '1', color: colors.gradientBottom },
  ]

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id="screenGradient" x1="0" y1="0" x2="0" y2="1">
          {stops.map((s) => (
            <Stop key={s.offset} offset={s.offset} stopColor={s.color} />
          ))}
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width={width} height={height} fill="url(#screenGradient)" />
    </Svg>
  )
}
