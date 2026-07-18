import { Pressable } from 'react-native'
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'
import { Paragraph } from './paragraph'

export type ToastType = 'info' | 'success' | 'error' | 'warning'

const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

/** A single toast. The ToastProvider mounts/unmounts these to drive enter/exit. */
export function Toast({ message, type = 'info', onPress }: { message: string; type?: ToastType; onPress?: () => void }) {
  const colors = useColors()
  const accent = { info: colors.info, success: colors.success, error: colors.error, warning: colors.warning }[type]

  return (
    <AnimatedPressable
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(200)}
      onPress={onPress}
      style={shadowsTheme.md}
      className="w-full flex-row items-center gap-3 rounded-2xl bg-surface px-4 py-3"
    >
      <Animated.View style={{ backgroundColor: accent }} className="h-2 w-2 rounded-full" />
      <Paragraph appear={false} className="flex-1 font-medium">
        {message}
      </Paragraph>
    </AnimatedPressable>
  )
}
