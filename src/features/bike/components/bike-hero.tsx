import { Image, View } from 'react-native'
import { Clock } from 'iconsax-react-nativejs'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'
import { STATUS, type BikeStatusKind } from '../services/bike.dto'

const MOTO = require('../../../../assets/moto.png')

type Props = {
  model: string
  plate: string
  status: BikeStatusKind
  lastSeen: string
  delay?: number
}

/** Bike identity on a light card: moto photo tile (left) + model/plate/status/last-seen (right). */
export function BikeHero({ model, plate, status, lastSeen, delay = 0 }: Props) {
  const colors = useColors()
  const st = STATUS[status]

  return (
    <Card delay={delay} className="flex-row items-center gap-4 rounded-3xl border-transparent bg-surface p-4">
      <View className="h-24 w-24 items-center justify-center overflow-hidden rounded-2xl">
        <Image source={MOTO} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
      </View>

      <View className="flex-1 gap-2.5">
        <Row className="items-start justify-between gap-2">
          <View className="flex-1">
            <Paragraph appear={false} numberOfLines={1} className="text-lg font-bold text-foreground">
              {model}
            </Paragraph>
            <Paragraph
              appear={false}
              numberOfLines={1}
              style={{ fontFamily: fontTheme.mono }}
              className="mt-0.5 text-xs uppercase tracking-wider text-subtle"
            >
              {plate}
            </Paragraph>
          </View>
          <Row className="items-center gap-1.5 rounded-full bg-surfaceMuted px-2.5 py-1">
            <View className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
            <Paragraph appear={false} className="text-xs font-semibold text-foreground">
              {st.label}
            </Paragraph>
          </Row>
        </Row>

        <Row className="items-center gap-1.5">
          <Clock size={13} color={colors.subtle} variant="Bold" />
          <Paragraph appear={false} className="text-xs text-muted">
            Vista {lastSeen}
          </Paragraph>
        </Row>
      </View>
    </Card>
  )
}
