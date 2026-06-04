import { useEffect } from 'react'
import { Pressable } from 'react-native'
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { useColors } from '@/theme/use-colors'

export function Switch({
  value,
  onChange,
  disabled,
}: {
  value: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
}) {
  const colors = useColors()
  const progress = useSharedValue(value ? 1 : 0)

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 160 })
  }, [value, progress])

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [colors.border, colors.primary]),
  }))
  const thumbStyle = useAnimatedStyle(() => ({ transform: [{ translateX: 2 + progress.value * 18 }] }))

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onChange(!value)}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      className={disabled ? 'opacity-40' : ''}
    >
      <Animated.View style={[{ width: 46, height: 28, borderRadius: 999, justifyContent: 'center', alignItems: 'flex-start' }, trackStyle]}>
        <Animated.View style={[{ width: 24, height: 24, borderRadius: 999, backgroundColor: colors.surface }, thumbStyle]} />
      </Animated.View>
    </Pressable>
  )
}
