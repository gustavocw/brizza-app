import type { ReactNode } from 'react'
import { useState } from 'react'
import { Pressable, StyleSheet, Text } from 'react-native'
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'

export const CHIP_HEIGHT = 52
const COLLAPSED_WIDTH = 46
const SPRING = { damping: 18, stiffness: 220, mass: 0.7 }
// Chip chrome around the label: icon (marginLeft 10 + 30) + label marginLeft 7
// + a little breathing room on the right. Added to the measured text width so
// the pill always fits its label — never squeezed into an ellipsis.
const LABEL_CHROME = 10 + 30 + 7 + 12

export type AnimatedTabChipProps = {
  label: string
  /** Renders the icon for a given color (called once per color state). */
  renderIcon: (color: string) => ReactNode
  isActive: boolean
  /** Fallback expanded width used until the label measures itself. */
  activeWidth: number
  onPress: () => void
}

function rgba(hex: string, alpha: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * One floating tab button: a pill that springs open (icon + label) when active
 * and collapses to an icon when not. A single spring drives width, background
 * fade, icon crossfade and label, so everything stays in sync. Themed via tokens.
 */
export function AnimatedTabChip({ label, renderIcon, isActive, activeWidth, onPress }: AnimatedTabChipProps) {
  const c = useColors()
  const transparentPrimary = rgba(c.primary, 0)

  // Measured natural width of the label (from a hidden, unconstrained copy) drives
  // the expanded width, so the pill grows to fit any label instead of clipping.
  const [labelWidth, setLabelWidth] = useState(0)
  const expandedWidth = labelWidth > 0 ? labelWidth + LABEL_CHROME : activeWidth

  const progress = useDerivedValue(() => withSpring(isActive ? 1 : 0, SPRING), [isActive])

  const containerStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [COLLAPSED_WIDTH, expandedWidth]),
    backgroundColor: interpolateColor(progress.value, [0, 1], [transparentPrimary, c.primary]),
  }))

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.3, 1], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateX: interpolate(progress.value, [0, 1], [-12, 0]) },
      { scale: interpolate(progress.value, [0, 1], [0.86, 1]) },
    ],
  }))

  const activeIconStyle = useAnimatedStyle(() => ({ opacity: progress.value }))
  const inactiveIconStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }))

  return (
    <Pressable onPress={onPress} accessibilityRole="tab" accessibilityState={{ selected: isActive }}>
      <Animated.View style={[styles.chip, containerStyle]}>
        <Animated.View style={styles.icon}>
          <Animated.View style={[styles.iconLayer, inactiveIconStyle]}>{renderIcon(c.subtle)}</Animated.View>
          <Animated.View style={[styles.iconLayer, activeIconStyle]}>{renderIcon(c.onPrimary)}</Animated.View>
        </Animated.View>
        <Animated.View style={[styles.labelWrap, labelStyle]} pointerEvents="none">
          <Text
            numberOfLines={1}
            style={[styles.label, { color: c.onPrimary, fontFamily: fontTheme.semibold }]}
          >
            {label}
          </Text>
        </Animated.View>
        {/* Hidden, unconstrained copy just to measure the label's natural width. */}
        <Text
          numberOfLines={1}
          onLayout={(e) => setLabelWidth(e.nativeEvent.layout.width)}
          style={[styles.label, styles.measure, { fontFamily: fontTheme.semibold }]}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    height: CHIP_HEIGHT,
    borderRadius: CHIP_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  iconLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWrap: {
    flex: 1,
    marginLeft: 7,
    paddingRight: 5,
  },
  label: {
    fontSize: 16.5,
  },
  measure: {
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0,
  },
})
