import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Flash, Health } from 'iconsax-react-nativejs'
import { BatteryRing } from '@/shared/components/ui/battery-ring'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { numberToBR, type MotoData } from '../services/bike.dto'

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <Row className="gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-2xl bg-primarySoft">{icon}</View>
      <View className="flex-1">
        <Paragraph appear={false} className="text-base font-bold text-foreground">
          {value}
        </Paragraph>
        <Paragraph appear={false} className="text-xs text-muted">
          {label}
        </Paragraph>
      </View>
    </Row>
  )
}

/** Battery gauge + autonomy and health, on a light card (ring track adapts to it). */
export function BatteryCard({ battery, delay = 0 }: { battery: MotoData['battery']; delay?: number }) {
  const colors = useColors()

  return (
    <Card elevated delay={delay} className="flex-row items-center gap-5 rounded-3xl border-transparent bg-surface p-5">
      <BatteryRing percent={battery.percent} size={104} track={colors.border} trackOpacity={1}>
        <Paragraph appear={false} className="text-[22px] font-bold text-foreground">
          {battery.percent}%
        </Paragraph>
        <Paragraph appear={false} className="text-[10px] uppercase tracking-wider text-subtle">
          bateria
        </Paragraph>
      </BatteryRing>

      <View className="flex-1 gap-3">
        <Stat
          icon={<Flash size={18} color={colors.primary} variant="Bold" />}
          value={`${numberToBR(battery.autonomyKm)} km`}
          label="de autonomia"
        />
        <View className="h-px bg-divider" />
        <Stat
          icon={<Health size={18} color={colors.primary} variant="Bold" />}
          value={`${battery.healthPct}%`}
          label={`saúde · ${battery.chargeCycles} ciclos`}
        />
      </View>
    </Card>
  )
}
