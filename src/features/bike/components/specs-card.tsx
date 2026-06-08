import { Fragment } from 'react'
import { View } from 'react-native'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { fontTheme } from '@/theme/theme'
import type { MotoData } from '../services/bike.dto'

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <Row className="items-center justify-between py-2.5">
      <Paragraph appear={false} className="text-sm text-muted">
        {label}
      </Paragraph>
      <Paragraph appear={false} style={{ fontFamily: fontTheme.monoMedium }} className="text-sm font-semibold text-foreground">
        {value}
      </Paragraph>
    </Row>
  )
}

/** Technical spec sheet (label → value rows) under a mono section caption. */
export function SpecsCard({ specs, delay = 0 }: { specs: MotoData['specs']; delay?: number }) {
  const rows = [
    { label: 'Potência', value: `${specs.powerKw} kW` },
    { label: 'Velocidade máxima', value: `${specs.topSpeedKmh} km/h` },
    { label: 'Autonomia máxima', value: `${specs.rangeKm} km` },
    { label: 'Tempo de carga', value: `${specs.chargeTimeH} h` },
    { label: 'Peso', value: `${specs.weightKg} kg` },
  ]

  return (
    <Card delay={delay} className="rounded-3xl border-transparent bg-surface px-4 pb-2 pt-4">
      <Paragraph
        appear={false}
        style={{ fontFamily: fontTheme.monoMedium }}
        className="px-1 pb-1 text-[11px] uppercase tracking-widest text-subtle"
      >
        Ficha técnica
      </Paragraph>
      {rows.map((r, i) => (
        <Fragment key={r.label}>
          {i > 0 ? <View className="h-px bg-divider" /> : null}
          <SpecRow label={r.label} value={r.value} />
        </Fragment>
      ))}
    </Card>
  )
}
