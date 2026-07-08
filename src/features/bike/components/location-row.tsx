import { Pressable, View } from 'react-native'
import { Location, Map } from 'iconsax-react-nativejs'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { useColors } from '@/theme/use-colors'
import type { MotoData } from '../services/bike.dto'

type Props = {
  location: MotoData['location']
  onPress: () => void
  delay?: number
}

/** Where the bike is parked. Tapping opens the spot in Google Maps. */
export function LocationRow({ location, onPress, delay = 0 }: Props) {
  const colors = useColors()

  return (
    <Card elevated delay={delay} className="rounded-3xl border-transparent bg-surface p-0">
      <Pressable onPress={onPress} className="flex-row items-center gap-3 p-4">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primarySoft">
          <Location size={22} color={colors.primary} variant="Bold" />
        </View>
        <View className="flex-1">
          <Paragraph appear={false} numberOfLines={1} className="font-semibold text-foreground">
            {location.address}
          </Paragraph>
          <Paragraph appear={false} className="text-xs text-muted">
            Estacionada · atualizado {location.updatedAgo}
          </Paragraph>
        </View>
        <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
          <Map size={20} color={colors.onPrimary} variant="Linear" />
        </View>
      </Pressable>
    </Card>
  )
}
