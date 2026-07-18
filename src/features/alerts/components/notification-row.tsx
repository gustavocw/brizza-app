import type { ComponentType } from 'react'
import { Pressable, View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { BatteryCharging, BatteryEmpty, BatteryFull, Flash, Gift, InfoCircle, Warning2 } from 'iconsax-react-nativejs'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'
import { CARD_BORDER } from '@/shared/constants/card-style'
import { timeAgo, type AppNotification, type NotificationKind } from '../services/notification.dto'

type IconCmp = ComponentType<{ size?: number; color?: string; variant?: 'Bold' | 'Linear' | 'Outline' | 'Bulk' | 'Broken' | 'TwoTone' }>
type Tone = 'error' | 'success' | 'primary' | 'warning' | 'info'

// kind → squircle chip color + icon. Falls back to `system` for unknown kinds.
const KIND: Record<NotificationKind, { Icon: IconCmp; bg: string; tone: Tone }> = {
  battery_low: { Icon: BatteryEmpty, bg: 'bg-errorSoft', tone: 'error' },
  battery_full: { Icon: BatteryFull, bg: 'bg-successSoft', tone: 'success' },
  charging_started: { Icon: Flash, bg: 'bg-primarySoft', tone: 'primary' },
  charging_complete: { Icon: BatteryCharging, bg: 'bg-successSoft', tone: 'success' },
  movement_alert: { Icon: Warning2, bg: 'bg-warningSoft', tone: 'warning' },
  marketing: { Icon: Gift, bg: 'bg-primarySoft', tone: 'primary' },
  system: { Icon: InfoCircle, bg: 'bg-infoSoft', tone: 'info' },
}

type Props = {
  notification: AppNotification
  onPress: () => void
}

/** One notification: kind chip + title/body/time, with an unread dot. */
export function NotificationRow({ notification, onPress }: Props) {
  const colors = useColors()
  const cfg = KIND[notification.kind] ?? KIND.system
  const Icon = cfg.Icon
  const unread = !notification.read_at

  return (
    <Pressable onPress={onPress} style={CARD_BORDER} className="flex-row items-center gap-3 rounded-3xl bg-surface p-4">
      <View className={twMerge('h-11 w-11 items-center justify-center rounded-2xl', cfg.bg)}>
        <Icon size={20} color={colors[cfg.tone]} variant="Bold" />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center gap-2">
          <Paragraph
            appear={false}
            numberOfLines={1}
            className={twMerge('flex-1 text-[15px] text-foreground', unread ? 'font-bold' : 'font-medium')}
          >
            {notification.title}
          </Paragraph>
          {unread ? <View className="h-2 w-2 rounded-full bg-primary" /> : null}
        </View>

        <Paragraph appear={false} numberOfLines={2} className="mt-0.5 text-sm text-muted">
          {notification.body}
        </Paragraph>

        <Paragraph
          appear={false}
          style={{ fontFamily: fontTheme.mono }}
          className="mt-1.5 text-[11px] uppercase tracking-wide text-subtle"
        >
          {timeAgo(notification.created_at)}
        </Paragraph>
      </View>
    </Pressable>
  )
}
