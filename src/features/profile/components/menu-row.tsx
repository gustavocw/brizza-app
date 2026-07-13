import type { ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { ArrowRight2 } from 'iconsax-react-nativejs'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'

type Tone = 'primary' | 'neutral' | 'danger'

type Props = {
  /** Pass the icon already colored to match the tone. */
  icon: ReactNode
  label: string
  sub?: string
  /** Right-aligned read-only value (mono). Replaces the chevron. */
  value?: string
  tone?: Tone
  onPress?: () => void
}

const chipBg: Record<Tone, string> = {
  primary: 'bg-secondarySoft',
  neutral: 'bg-surfaceMuted',
  danger: 'bg-errorSoft',
}

/**
 * One settings row: squircle icon chip + label (+ sub) and either a chevron
 * (navigational) or a mono value (read-only). Grouped inside a Card with dividers.
 */
export function MenuRow({ icon, label, sub, value, tone = 'primary', onPress }: Props) {
  const colors = useColors()
  const Container = onPress ? Pressable : View

  return (
    <Container
      onPress={onPress}
      className="flex-row items-center gap-3 py-3"
      {...(onPress ? { android_ripple: { color: colors.surfaceMuted } } : {})}
    >
      <View className={twMerge('h-11 w-11 items-center justify-center rounded-2xl', chipBg[tone])}>{icon}</View>

      <View className="flex-1">
        <Paragraph appear={false} numberOfLines={1} className={twMerge('font-medium text-foreground', tone === 'danger' && 'text-error')}>
          {label}
        </Paragraph>
        {sub ? (
          <Paragraph appear={false} numberOfLines={1} className="text-xs text-subtle">
            {sub}
          </Paragraph>
        ) : null}
      </View>

      {value ? (
        <Paragraph appear={false} style={{ fontFamily: fontTheme.mono }} className="text-xs text-muted">
          {value}
        </Paragraph>
      ) : onPress ? (
        <ArrowRight2 size={12} color={colors.primary} variant="Linear" />
      ) : null}
    </Container>
  )
}
