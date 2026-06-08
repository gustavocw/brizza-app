import { View } from 'react-native'
import { twMerge } from 'tailwind-merge'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { availabilityLabel, availabilityOf, availabilityTone, type ChargingStation } from '../services/station.dto'

/** Status pill: colored dot + slot-aware label ("4 vagas" / "Lotada" / "Fechada"). */
export function AvailabilityPill({ station }: { station: ChargingStation }) {
  const tone = availabilityTone(availabilityOf(station))
  return (
    <View className="flex-row items-center gap-1.5">
      <View className={twMerge('h-2 w-2 rounded-full', tone.dot)} />
      <Paragraph appear={false} className={twMerge('text-xs font-semibold', tone.text)}>
        {availabilityLabel(station)}
      </Paragraph>
    </View>
  )
}
