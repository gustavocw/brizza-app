import { View } from 'react-native'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { CARD_BORDER } from './card-style'
import { CopyAddressButton } from './copy-address-button'
import { MiniMap } from './mini-map'

type Props = {
  address: string
  city: string
  updatedAgo: string
  latitude: number
  longitude: number
  onCopy: () => void
  delay?: number
}

/**
 * Vehicle's current location: an interactive Google map (pan + zoom in place, no
 * external app) on top, with the address below and a copy-address FAB.
 */
export function LocationCard({ address, city, updatedAgo, latitude, longitude, onCopy, delay = 0 }: Props) {
  return (
    <Card delay={delay} style={CARD_BORDER} className="rounded-3xl bg-surface p-0">
      <View style={{ height: 160 }} className="overflow-hidden rounded-t-3xl">
        <MiniMap latitude={latitude} longitude={longitude} />
      </View>

      <View className="flex-row items-center gap-3 p-4">
        <View className="flex-1">
          <Paragraph appear={false} className="font-semibold text-foreground">
            {address}
          </Paragraph>
          <Paragraph appear={false} className="text-xs text-muted">
            {city} · atualizado {updatedAgo}
          </Paragraph>
        </View>
        <CopyAddressButton onCopy={onCopy} />
      </View>
    </Card>
  )
}
