import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Paragraph } from './paragraph'

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info'

const bg: Record<BadgeTone, string> = {
  neutral: 'bg-surfaceMuted',
  primary: 'bg-primarySoft',
  success: 'bg-successSoft',
  warning: 'bg-warningSoft',
  error: 'bg-errorSoft',
  info: 'bg-infoSoft',
}
const fg: Record<BadgeTone, string> = {
  neutral: 'text-muted',
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  info: 'text-info',
}

export function Badge({ label, tone = 'neutral', className }: { label: string; tone?: BadgeTone; className?: string }) {
  return (
    <View className={twMerge('self-start rounded-full px-2.5 py-1', bg[tone], className)}>
      <Paragraph appear={false} className={twMerge('text-xs font-semibold', fg[tone])}>
        {label}
      </Paragraph>
    </View>
  )
}
