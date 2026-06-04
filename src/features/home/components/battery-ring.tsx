import type { ReactNode } from 'react'
import { View } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { useColors } from '@/theme/use-colors'

type Props = {
  percent: number
  size?: number
  stroke?: number
  children?: ReactNode
}

/** Circular battery gauge: a track + an accent progress arc starting at 12 o'clock. */
export function BatteryRing({ percent, size = 118, stroke = 9, children }: Props) {
  const colors = useColors()
  const clamped = Math.min(Math.max(percent, 0), 100)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (clamped / 100) * circumference
  const center = size / 2

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.onPrimary}
          strokeOpacity={0.16}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference - progress}`}
          fill="none"
        />
      </Svg>
      <View className="absolute inset-0 items-center justify-center">{children}</View>
    </View>
  )
}
