import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'
import { CARD_BORDER } from '@/shared/constants/card-style'

type Props = {
  state: string
  tempC: number
  delay?: number
}

/** Motor status: state on the left, temperature on the right. */
export function MotorCard({ state, tempC, delay = 0 }: Props) {
  const colors = useColors()

  return (
    <Card delay={delay} style={CARD_BORDER} className="flex-row items-center gap-4 rounded-3xl bg-surface p-4">
      <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primarySoft">
        <MaterialCommunityIcons name="engine" size={22} color={colors.primary} />
      </View>
      <View className="flex-1">
        <Paragraph
          appear={false}
          style={{ fontFamily: fontTheme.mono }}
          className="text-[10px] uppercase tracking-wider text-subtle"
        >
          Motor
        </Paragraph>
        <Paragraph appear={false} className="text-lg font-semibold text-secondary">
          {state}
        </Paragraph>
      </View>
      <Row className="items-baseline gap-0.5">
        <Paragraph appear={false} className="text-lg font-semibold text-secondary">
          {tempC}
        </Paragraph>
        <Paragraph appear={false} className="text-sm text-muted">
          °C
        </Paragraph>
      </Row>
    </Card>
  )
}
