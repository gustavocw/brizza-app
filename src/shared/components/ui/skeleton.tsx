import { useEffect } from 'react'
import type { ViewStyle } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import { twMerge } from 'tailwind-merge'

/** Pulsing placeholder for loading states. Size it via className or style. */
export function Skeleton({ className, style }: { className?: string; style?: ViewStyle }) {
  const opacity = useSharedValue(0.5)

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }), -1, true)
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return <Animated.View style={[animatedStyle, style]} className={twMerge('rounded-md bg-surfaceMuted', className)} />
}
