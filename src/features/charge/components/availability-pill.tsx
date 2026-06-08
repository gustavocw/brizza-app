import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { AVAILABILITY, type Availability } from '../services/station.dto'

/** Status pill: colored dot + label (available / busy / offline). */
export function AvailabilityPill({ availability }: { availability: Availability }) {
  const cfg = AVAILABILITY[availability]
  return (
    <View className="flex-row items-center gap-1.5">
      <View className={twMerge('h-2 w-2 rounded-full', cfg.dot)} />
      <Paragraph appear={false} className={twMerge('text-xs font-semibold', cfg.text)}>
        {cfg.label}
      </Paragraph>
    </View>
  )
}
