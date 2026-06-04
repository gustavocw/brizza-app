import { useCallback, useEffect, type ReactNode } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'

export type DialogProps = {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  dismissOnBackdrop?: boolean
  backdropOpacity?: number
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

/** Centered modal card. Mounted on the overlay host via useDialog(). Stacks. */
export function Dialog({ isOpen, onClose, children, dismissOnBackdrop = true, backdropOpacity = 0.5 }: DialogProps) {
  const colors = useColors()
  const progress = useSharedValue(0)

  const animateClose = useCallback(() => {
    progress.value = withTiming(0, { duration: 160 }, (finished) => {
      if (finished) runOnJS(onClose)()
    })
  }, [onClose, progress])

  useEffect(() => {
    if (isOpen) progress.value = withSpring(1, { damping: 18, stiffness: 220 })
    else animateClose()
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value * backdropOpacity }))
  const cardStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.92 + 0.08 * progress.value }],
  }))

  return (
    <View style={StyleSheet.absoluteFill} className="items-center justify-center p-6" pointerEvents="box-none">
      <AnimatedPressable
        style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
        pointerEvents={isOpen ? 'auto' : 'none'}
        onPress={dismissOnBackdrop ? animateClose : undefined}
      />
      <Animated.View
        style={[cardStyle, shadowsTheme.lg, { backgroundColor: colors.surface }]}
        className="w-full max-w-[400px] rounded-3xl p-5"
      >
        {children}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({ backdrop: { backgroundColor: '#000000' } })
