import { Image, View } from 'react-native'
import { Card } from '@/shared/components/ui/card'
import { CARD_BORDER } from '@/shared/constants/card-style'

const MOTO = require('../../../../assets/moto.png')

/** Bike banner — just the moto photo on a white rounded card (no actions). */
export function BikeCard({ delay = 0 }: { delay?: number }) {
  return (
    <Card
      delay={delay}
      style={CARD_BORDER}
      className="rounded-3xl bg-surface p-0"
    >
      <View style={{ height: 200 }} className="items-center justify-center overflow-hidden rounded-3xl">
        <Image source={MOTO} resizeMode="contain" style={{ width: '96%', height: '96%' }} />
      </View>
    </Card>
  )
}
