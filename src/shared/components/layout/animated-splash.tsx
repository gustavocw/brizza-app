import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, StyleSheet } from 'react-native'
import { useColors } from '@/theme/use-colors'
import { Paragraph } from '@/shared/components/ui'

// Official brizze wordmark (navy + green), same asset the native splash uses.
const WORDMARK = require('../../../../assets/brizze-wordmark.png')

/**
 * JS splash overlay painted on top of the native splash image. Shows the official
 * wordmark (the native splash can only render an image) with a small "Motos"
 * caption. Content animates in (opacity + scale), then the overlay fades out.
 * Always shown on cold start.
 */
export function AnimatedSplash() {
  const colors = useColors()
  const [visible, setVisible] = useState(true)
  const enter = useRef(new Animated.Value(0)).current // content entrance 0 → 1
  const fade = useRef(new Animated.Value(1)).current // overlay fade-out 1 → 0

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start()

    const timer = setTimeout(() => {
      Animated.timing(fade, { toValue: 0, duration: 320, useNativeDriver: true }).start(() =>
        setVisible(false),
      )
    }, 1050)
    return () => clearTimeout(timer)
  }, [enter, fade])

  if (!visible) return null

  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] })

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          opacity: fade,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
    >
      <Animated.View style={{ alignItems: 'center', opacity: enter, transform: [{ scale }] }}>
        <Image source={WORDMARK} style={{ width: 212, height: 69 }} resizeMode="contain" />
        <Paragraph appear={false} className="mt-2 text-xs uppercase tracking-widest text-subtle">
          Motos
        </Paragraph>
      </Animated.View>
    </Animated.View>
  )
}
