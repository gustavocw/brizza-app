import { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import { Keyboard } from 'iconsax-react-nativejs'
import { Button, Paragraph, Title } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { QrScanner } from './qr-scanner'

type Props = {
  onScan: (data: string) => void
  onManual: () => void
  linking: boolean
}

const RESPIRO = 550 // pause after the motion ends before the handoff
const DURATION = 480 // crossfade duration

/**
 * No-bike state. The Lottie intro plays once, pauses for a beat, then hands off to
 * the live QR scanner with an Apple-style crossfade (intro scales down + fades out
 * while the scanner scales up + fades in). The manual button routes to the plate form.
 */
export function NoBikeState({ onScan, onManual, linking }: Props) {
  const colors = useColors()
  const [revealed, setRevealed] = useState(false) // scanner mounted (handoff started)
  const [introGone, setIntroGone] = useState(false) // intro unmounted (handoff done)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const introOpacity = useSharedValue(1)
  const introScale = useSharedValue(1)
  const scanOpacity = useSharedValue(0)
  const scanScale = useSharedValue(0.88)

  useEffect(() => () => clearTimeout(timer.current), [])

  const onMotionFinish = () => {
    timer.current = setTimeout(() => {
      setRevealed(true)
      introOpacity.value = withTiming(0, { duration: DURATION, easing: Easing.inOut(Easing.cubic) })
      introScale.value = withTiming(0.82, { duration: DURATION, easing: Easing.inOut(Easing.cubic) })
      scanOpacity.value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) })
      scanScale.value = withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) }, (finished) => {
        if (finished) runOnJS(setIntroGone)(true)
      })
    }, RESPIRO)
  }

  const introStyle = useAnimatedStyle(() => ({ opacity: introOpacity.value, transform: [{ scale: introScale.value }] }))
  const scanStyle = useAnimatedStyle(() => ({ opacity: scanOpacity.value, transform: [{ scale: scanScale.value }] }))

  return (
    <View className="flex-1 px-5 pb-24 pt-8">
      <Title className="text-center text-[22px]">Nenhuma moto vinculada</Title>

      <View className="flex-1 items-center justify-center gap-5">
        <View style={{ width: 300, height: 300 }} className="items-center justify-center">
          {!introGone ? (
            <Animated.View style={[StyleSheet.absoluteFill, introStyle]} className="items-center justify-center">
              <LottieView
                autoPlay
                loop={false}
                onAnimationFinish={onMotionFinish}
                source={require('../../../../assets/lottie/qr-code.json')}
                style={{ width: 240, height: 240 }}
              />
            </Animated.View>
          ) : null}

          {revealed ? (
            <Animated.View style={[StyleSheet.absoluteFill, scanStyle]} className="items-center justify-center">
              <QrScanner onScan={onScan} busy={linking} />
            </Animated.View>
          ) : null}
        </View>

        {revealed ? (
          <Animated.View style={scanStyle}>
            <Paragraph appear={false} className="text-center text-muted">
              Aponte para o QR code da sua moto.
            </Paragraph>
          </Animated.View>
        ) : null}
      </View>

      <Button
        label="Inserir placa manualmente"
        icon={<Keyboard size={20} color={colors.primary} variant="Bold" />}
        onPress={onManual}
      />
    </View>
  )
}
