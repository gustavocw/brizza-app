import { Fragment } from 'react'
import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import type { DashboardData } from '../services/dashboard.dto'
import { CARD_BORDER } from './card-style'

/** Technical spec sheet (label → value rows) under a titled header. */
export function SpecsCard({ specs, delay = 0 }: { specs: DashboardData['specs']; delay?: number }) {
  const colors = useColors()
  const rows = [
    { label: 'Potência', value: `${specs.powerKw} kW` },
    { label: 'Velocidade máxima', value: `${specs.topSpeedKmh} km/h` },
    { label: 'Autonomia máxima', value: `${specs.rangeKm} km` },
    { label: 'Peso', value: `${specs.weightKg} kg` },
  ]

  return (
    <Card delay={delay} style={CARD_BORDER} className="rounded-3xl bg-surface px-5 pb-3 pt-4">
      <Row className="items-center gap-3 pb-2">
        <View className="h-9 w-9 items-center justify-center rounded-full bg-primarySoft">
          <MaterialCommunityIcons name="clipboard-text-outline" size={18} color={colors.primary} />
        </View>
        <Paragraph appear={false} className="text-[15px] font-medium text-foreground">
          Ficha técnica
        </Paragraph>
      </Row>

      {rows.map((r, i) => (
        <Fragment key={r.label}>
          {i > 0 ? <View className="h-px bg-divider" /> : null}
          <Row className="items-center justify-between py-2.5">
            <Paragraph appear={false} className="text-sm text-muted">
              {r.label}
            </Paragraph>
            <Paragraph appear={false} className="text-sm font-semibold text-secondary">
              {r.value}
            </Paragraph>
          </Row>
        </Fragment>
      ))}
    </Card>
  )
}
