import { View } from 'react-native'
import { Clock } from 'iconsax-react-nativejs'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'
import { STATUS, type BikeStatusKind } from '../services/bike.dto'

type Props = {
  model: string
  plate: string
  status: BikeStatusKind
  lastSeen: string
  delay?: number
}

/** Slim bike identity header for the Motor screen: model/plate/status + last seen.
 *  The bike photo now lives on the Home hero, so this stays text-only. */
export function BikeHero({ model, plate, status, lastSeen, delay = 0 }: Props) {
  const colors = useColors()
  const st = STATUS[status]

  return (
    <Card elevated delay={delay} className="rounded-3xl border-transparent bg-surface p-5">
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

      <Row className="mt-3 items-center gap-1.5">
        <Clock size={13} color={colors.subtle} variant="Bold" />
        <Paragraph appear={false} className="text-xs text-muted">
          Vista {lastSeen}
        </Paragraph>
      </Row>
    </Card>
  )
}
