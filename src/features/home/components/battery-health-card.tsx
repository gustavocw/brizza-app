import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { CARD_BORDER } from '@/shared/constants/card-style'

type Props = {
  healthPct: number
  chargeCycles: number
  chargeTimeH: number
  delay?: number
}

/** Battery health: big health %, plus charge cycles and recharge time below. */
export function BatteryHealthCard({ healthPct, chargeCycles, chargeTimeH, delay = 0 }: Props) {
  const colors = useColors()

  return (
    <Card delay={delay} style={CARD_BORDER} className="gap-4 rounded-3xl bg-surface p-5">
      <Row className="items-start justify-between gap-2">
        <Paragraph appear={false} className="text-[15px] font-medium text-foreground">
          Saúde da bateria
        </Paragraph>
        <View className="h-9 w-9 items-center justify-center rounded-full bg-primarySoft">
          <MaterialCommunityIcons name="battery-heart-variant" size={18} color={colors.primary} />
        </View>
      </Row>

      <Row className="items-baseline gap-1.5">
        <Paragraph appear={false} className="text-[30px] font-semibold leading-9 text-secondary">
          {healthPct}
        </Paragraph>
        <Paragraph appear={false} className="text-sm text-muted">
          %
        </Paragraph>
      </Row>

      <View className="h-px bg-divider" />

      <Row className="gap-10">
        <View>
          <Paragraph appear={false} className="text-base font-semibold text-secondary">
            {chargeCycles}
          </Paragraph>
          <Paragraph appear={false} className="text-xs text-muted">
            ciclos de carga
          </Paragraph>
        </View>
        <View>
          <Paragraph appear={false} className="text-base font-semibold text-secondary">
            {chargeTimeH} h
          </Paragraph>
          <Paragraph appear={false} className="text-xs text-muted">
            tempo de recarga
          </Paragraph>
        </View>
      </Row>
    </Card>
  )
}
