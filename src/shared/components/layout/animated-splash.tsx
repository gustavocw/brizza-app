import { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, StyleSheet } from 'react-native'
import { useColors } from '@/theme/use-colors'
import { Title } from '@/shared/components/ui'

// Trimmed to the drawing's real bounds (no transparent padding), so the name
// sits right under the logo.
const LOGO = require('../../../../assets/splash-logo.png')

/**
 * JS splash overlay painted on top of the native splash image. The native splash
 * (expo-splash-screen) can only render an image, so the app name lives here: a
 * centered logo with the name right below it, on the same background. The content
 * animates in (opacity + scale), then the whole overlay fades out. Always shown
 * on cold start.
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
        <Image source={LOGO} style={{ width: 84, height: 54 }} resizeMode="contain" />
        <Title appear={false} className="mt-3 text-2xl">
          Brizze Motos
        </Title>
      </Animated.View>
    </Animated.View>
  )
}
