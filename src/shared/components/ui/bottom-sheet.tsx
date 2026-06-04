import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Dimensions, Pressable, ScrollView, StyleSheet, View, type LayoutChangeEvent } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import { useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'

export type BottomSheetProps = {
  /** Controlled visibility. Driving this false plays the close animation. */
  isOpen: boolean
  /** Fires once the sheet has FULLY animated closed (use it to unmount). */
  onClose: () => void
  children: ReactNode
  /** Fixed height in px. Omit to size to content. */
  height?: number
  /** Size to content height (clamped to maxHeightRatio). Defaults to true when no `height`. */
  snapToContent?: boolean
  /** Cap as a fraction of screen height. Default 0.9. */
  maxHeightRatio?: number
  backgroundColor?: string
  /** Backdrop opacity at rest. Default 0.5. */
  backdropOpacity?: number
  /** Tap the backdrop to dismiss. Default true. */
  dismissOnBackdrop?: boolean
  /** Swipe down to dismiss. Default true. */
  swipeToDismiss?: boolean
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

const OPEN_SPRING = { damping: 22, stiffness: 240, mass: 0.9 }
const CLOSE_TIMING = { duration: 240, easing: Easing.in(Easing.cubic) }
const SWIPE_CLOSE_DISTANCE = 90
const SWIPE_CLOSE_VELOCITY = 800
// The open spring is underdamped (it overshoots past 0), which briefly lifts the
// sheet and reveals a gap at the bottom. This bleed extends the sheet background
// below the screen to cover that overshoot — keeping the bouncy feel, no gap.
const BOTTOM_BLEED = 160

/**
 * Presentational sheet. You rarely render this directly — use useBottomSheet()
 * which mounts it on the stackable overlay host. Multiple instances stack.
 *
 * Keyboard handling: the whole sheet rides above the keyboard (no input ever
 * covered), and tall content scrolls internally instead of pushing the layout.
 */
export function BottomSheet({
  isOpen,
  onClose,
  children,
  height,
  snapToContent,
  maxHeightRatio = 0.9,
  backgroundColor,
  backdropOpacity = 0.5,
  dismissOnBackdrop = true,
  swipeToDismiss = true,
}: BottomSheetProps) {
  const insets = useSafeAreaInsets()
  const colors = useColors()
  const screenH = Dimensions.get('window').height
  const maxH = Math.min(screenH * maxHeightRatio, screenH - insets.top - 24)

  const fitContent = snapToContent ?? height == null
  const [measuredH, setMeasuredH] = useState(0)
  const rawH = height ?? measuredH
  const effectiveH = rawH > 0 ? Math.min(rawH, maxH) : maxH
  const needsScroll = fitContent && measuredH > maxH

  const translateY = useSharedValue(screenH)
  const startY = useSharedValue(0)
  const keyboard = useReanimatedKeyboardAnimation() // height.value is negative when open

  const animateClose = useCallback(() => {
    translateY.value = withTiming(screenH, CLOSE_TIMING, (finished) => {
      if (finished) runOnJS(onClose)()
    })
  }, [onClose, screenH, translateY])

  useEffect(() => {
    if (isOpen) translateY.value = withSpring(0, OPEN_SPRING)
    else animateClose()
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const onContentLayout = (e: LayoutChangeEvent) => {
    if (!fitContent) return
    const h = Math.round(e.nativeEvent.layout.height)
    if (h && h !== measuredH) setMeasuredH(h)
  }

  const pan = Gesture.Pan()
    .enabled(swipeToDismiss)
    .onStart(() => {
      startY.value = translateY.value
    })
    .onUpdate((e) => {
      translateY.value = Math.max(0, startY.value + e.translationY)
    })
    .onEnd((e) => {
      if (e.translationY > SWIPE_CLOSE_DISTANCE || e.velocityY > SWIPE_CLOSE_VELOCITY) {
        translateY.value = withTiming(screenH, CLOSE_TIMING, (finished) => {
          if (finished) runOnJS(onClose)()
        })
      } else {
        translateY.value = withSpring(0, OPEN_SPRING)
      }
    })

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.value }] }))
  // Lift the sheet above the keyboard. abs() makes it robust to the lib's sign convention.
  const keyboardStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -Math.abs(keyboard.height.value) }] }))
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [0, effectiveH || screenH], [backdropOpacity, 0], Extrapolation.CLAMP),
  }))

  const body = (
    <View onLayout={onContentLayout} style={{ paddingBottom: insets.bottom + 16 }}>
      {children}
    </View>
  )

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <AnimatedPressable
        style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}
        pointerEvents={isOpen ? 'auto' : 'none'}
        onPress={dismissOnBackdrop ? animateClose : undefined}
      />

      <Animated.View style={[styles.kbWrap, keyboardStyle]} pointerEvents="box-none">
        {/* translateY rides on this wrapper so the bleed moves with the sheet. */}
        <Animated.View style={sheetStyle}>
          {/* Background bleed: extends below the screen to cover the spring overshoot. */}
          <View
            pointerEvents="none"
            style={[styles.bleed, shadowsTheme.lg, { backgroundColor: backgroundColor ?? colors.surface }]}
          />

          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: backgroundColor ?? colors.surface,
                height: fitContent && !needsScroll ? undefined : effectiveH,
                maxHeight: maxH,
              },
            ]}
          >
            <GestureDetector gesture={pan}>
              <View style={styles.handleZone} hitSlop={{ top: 8, bottom: 8, left: 24, right: 24 }}>
                <View style={[styles.handle, { backgroundColor: colors.border }]} />
              </View>
            </GestureDetector>

            {needsScroll ? (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                showsVerticalScrollIndicator={false}
              >
                {body}
              </ScrollView>
            ) : (
              body
            )}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  backdrop: { backgroundColor: '#000000' },
  kbWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  bleed: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: -BOTTOM_BLEED,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheet: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handleZone: { alignItems: 'center', paddingTop: 10, paddingBottom: 6 },
  handle: { width: 40, height: 5, borderRadius: 999 },
})
