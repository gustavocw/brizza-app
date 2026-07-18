import { useEffect, useRef, useState } from 'react'
import { Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'
import { Copy, CopySuccess } from 'iconsax-react-nativejs'
import { useColors } from '@/theme/use-colors'

/** Neutral copy FAB with a tap bounce + icon→check micro-interaction. */
export function CopyAddressButton({ onCopy }: { onCopy: () => void }) {
  const colors = useColors()
  const [copied, setCopied] = useState(false)
  const scale = useSharedValue(1)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    scale.value = withSequence(
      withSpring(0.82, { damping: 12, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 220 }),
    )
    onCopy()
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 1600)
  }

  return (
    <Pressable onPress={handlePress} hitSlop={8} accessibilityRole="button" accessibilityLabel="Copiar endereço">
      <Animated.View style={animatedStyle} className="h-11 w-11 items-center justify-center rounded-full bg-surfaceMuted">
        {copied ? (
          <CopySuccess size={20} color={colors.primary} variant="Bold" />
        ) : (
          <Copy size={20} color={colors.muted} variant="Linear" />
        )}
      </Animated.View>
    </Pressable>
  )
}
