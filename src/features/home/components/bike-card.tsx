import { Image, View, type ImageSourcePropType } from 'react-native'
import { Card } from '@/shared/components/ui/card'

/** Bike banner — the selected moto's photo on a white rounded card (no border/actions). */
export function BikeCard({ image, delay = 0 }: { image: ImageSourcePropType; delay?: number }) {
  return (
    <Card delay={delay} style={{ borderWidth: 0 }} className="rounded-3xl p-0">
      <View style={{ height: 200 }} className="overflow-hidden rounded-3xl">
        <Image source={image} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
      </View>
    </Card>
  )
}
