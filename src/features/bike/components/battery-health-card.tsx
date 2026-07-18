import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Flash, Health } from 'iconsax-react-nativejs'
import { BatteryRing } from '@/shared/components/ui/battery-ring'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import type { MotoData } from '../services/bike.dto'

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <Row className="gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-2xl bg-secondarySoft">{icon}</View>
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

type Props = {
  battery: MotoData['battery']
  chargeTimeH: number
  delay?: number
}

/** Battery health detail: health gauge + cycles + charge time (deeper than the Home glance). */
export function BatteryHealthCard({ battery, chargeTimeH, delay = 0 }: Props) {
  const colors = useColors()

  return (
    <Card elevated delay={delay} className="flex-row items-center gap-5 rounded-3xl border-transparent bg-surface p-5">
      <BatteryRing percent={battery.healthPct} size={104} track={colors.border} trackOpacity={1}>
        <Paragraph appear={false} className="text-[22px] font-bold text-foreground">
          {battery.healthPct}%
        </Paragraph>
        <Paragraph appear={false} className="text-[10px] uppercase tracking-wider text-subtle">
          saúde
        </Paragraph>
      </BatteryRing>

      <View className="flex-1 gap-3">
        <Stat
          icon={<Health size={18} color={colors.secondary} variant="Bold" />}
          value={`${battery.chargeCycles}`}
          label="ciclos de carga"
        />
        <View className="h-px bg-divider" />
        <Stat
          icon={<Flash size={18} color={colors.secondary} variant="Bold" />}
          value={`${chargeTimeH} h`}
          label="tempo de carga"
        />
      </View>
    </Card>
  )
}
