import { View } from 'react-native'
import { Setting2 } from 'iconsax-react-nativejs'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'
import type { MotoData } from '../services/bike.dto'

type Props = {
  telemetry: MotoData['telemetry']
  delay?: number
}

/** Motor status: state + temperature. The technical detail, relocated off the Home. */
export function MotorCard({ telemetry, delay = 0 }: Props) {
  const colors = useColors()

  return (
    <Card elevated delay={delay} className="flex-row items-center gap-4 rounded-3xl border-transparent bg-surface p-5">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-secondarySoft">
        <Setting2 size={26} color={colors.secondary} variant="Bold" />
      </View>
      <View className="flex-1">
        <Paragraph
          appear={false}
          style={{ fontFamily: fontTheme.mono }}
          className="text-[10px] uppercase tracking-wider text-subtle"
        >
          Motor
        </Paragraph>
        <Paragraph appear={false} className="text-lg font-bold text-foreground">
          {telemetry.motorState}
        </Paragraph>
      </View>
      <Row className="items-baseline gap-1">
        <Paragraph appear={false} className="text-xl font-bold text-foreground">
          {telemetry.motorTempC}
        </Paragraph>
        <Paragraph appear={false} className="text-sm text-muted">
          °C
        </Paragraph>
      </Row>
    </Card>
  )
}
