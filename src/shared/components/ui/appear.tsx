import { Children, cloneElement, isValidElement, useEffect, type ReactNode } from 'react'
import type { ViewProps } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

export type AppearConfig = {
  /** ms before the animation starts. Stagger siblings for a domino effect. */
  delay?: number
  /** ms the animation runs. Default 280. Ignored when `spring` is set. */
  duration?: number
  /** Initial scale (1 = no scale). Default 0.96 — a subtle pop. */
  scaleFrom?: number
  /** Optional slide-up distance in px (0 = none). */
  translateY?: number
  /** Spring the entrance instead of easing it (a bit of bounce/overshoot). */
  spring?: boolean
  /** Skip the animation (render final state). Use inside virtualized lists. */
  disabled?: boolean
}

/**
 * The one entrance animation, as a hook. Returns an animated style you can drop
 * on any Animated.* component (View, Text, Image…). Runs ONCE on mount.
 *
 *   const style = useAppear({ delay: 120 })
 *   <Animated.Text style={style}>hi</Animated.Text>
 */
export function useAppear({
  delay = 0,
  duration = 280,
  scaleFrom = 0.96,
  translateY = 0,
  spring = false,
  disabled = false,
}: AppearConfig = {}) {
  const progress = useSharedValue(disabled ? 1 : 0)

  useEffect(() => {
    if (disabled) {
      progress.value = 1
      return
    }
    const animation = spring
      ? withSpring(1, { damping: 15, stiffness: 150, mass: 0.8 })
      : withTiming(1, { duration, easing: Easing.out(Easing.cubic) })
    progress.value = withDelay(delay, animation)
  }, [disabled, delay, duration, spring, progress])

  return useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      { scale: scaleFrom + (1 - scaleFrom) * progress.value },
      { translateY: translateY * (1 - progress.value) },
    ],
  }))
}

export type AppearProps = ViewProps & AppearConfig

/**
 * Drop-in animated container. Fade + slight scale on entry, optional delay.
 *
 *   <Appear delay={120} className="gap-3">…</Appear>
 */
export function Appear({ delay, duration, scaleFrom, translateY, spring, disabled, style, children, ...rest }: AppearProps) {
  const animatedStyle = useAppear({ delay, duration, scaleFrom, translateY, spring, disabled })
  return (
    <Animated.View style={[style, animatedStyle]} {...rest}>
      {children}
    </Animated.View>
  )
}

export type AppearGroupProps = {
  /** ms added per child → the domino step. Default 60. */
  stagger?: number
  /** ms before the first child animates. Default 0. */
  initialDelay?: number
  children: ReactNode
}

/**
 * Auto-staggers any children that accept a `delay` prop (Appear, Button,
 * Paragraph, Title…) so you get a domino without computing delays by hand.
 *
 *   <AppearGroup stagger={70}>
 *     <Title>…</Title>
 *     <Paragraph>…</Paragraph>
 *     <Button label="ok" />
 *   </AppearGroup>
 */
export function AppearGroup({ stagger = 60, initialDelay = 0, children }: AppearGroupProps) {
  let index = 0
  return (
    <>
      {Children.map(children, (child) => {
        if (!isValidElement(child)) return child
        const i = index++
        const childDelay = (child.props as { delay?: number }).delay ?? 0
        return cloneElement(child as any, { delay: childDelay + initialDelay + i * stagger })
      })}
    </>
  )
}
