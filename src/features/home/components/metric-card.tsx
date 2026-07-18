import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { CARD_BORDER } from './card-style'

type Props = {
  label: string
  value: string
  unit?: string
  icon: ReactNode
  delay?: number
}

/** Metric tile: prominent label + colored icon chip on top, then a big number with a small unit. */
export function MetricCard({ label, value, unit, icon, delay = 0 }: Props) {
  return (
    <View className="flex-1">
      <Card delay={delay} style={CARD_BORDER} className="gap-7 rounded-3xl bg-surface p-5">
        <Row className="items-start justify-between gap-2">
          <Paragraph appear={false} numberOfLines={2} className="flex-1 text-[15px] font-medium leading-5 text-foreground">
            {label}
          </Paragraph>
          <View className="h-9 w-9 items-center justify-center rounded-full bg-primarySoft">{icon}</View>
        </Row>
        <Row className="items-baseline gap-1.5">
          <Paragraph appear={false} numberOfLines={1} className="text-[30px] font-semibold leading-9 text-secondary">
            {value}
          </Paragraph>
          {unit ? (
            <Paragraph appear={false} className="text-sm text-muted">
              {unit}
            </Paragraph>
          ) : null}
        </Row>
      </Card>
    </View>
  )
}
