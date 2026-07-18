import { View } from 'react-native'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { CARD_SHADOW } from './card-style'

const BARS = 10

/** Big horizontal segmented battery gauge (chunky battery icon) on the dark-green card. */
function BatteryGauge({ percent }: { percent: number }) {
  const colors = useColors()
  const filled = Math.round((percent / 100) * BARS)
  return (
    <Row className="items-center">
      <Row
        className="items-stretch gap-1 rounded-[18px]"
        style={{ borderWidth: 3, borderColor: colors.onForestLine, width: 190, height: 84, padding: 9 }}
      >
        {Array.from({ length: BARS }).map((_, i) => (
          <View
            key={i}
            className="flex-1 rounded-[4px]"
            style={{ backgroundColor: i < filled ? colors.accent : colors.onForestTrack }}
          />
        ))}
      </Row>
      {/* battery terminal */}
      <View
        style={{
          width: 7,
          height: 34,
          marginLeft: -1,
          borderTopRightRadius: 3,
          borderBottomRightRadius: 3,
          backgroundColor: colors.onForestLine,
        }}
      />
    </Row>
  )
}

/** Battery status: big % on the left, a chunky segmented gauge on the right, on a dark-green card. */
export function BatteryStatusCard({ percent, delay = 0 }: { percent: number; delay?: number }) {
  return (
    <Card
      delay={delay}
      style={CARD_SHADOW}
      className="flex-row items-center justify-between rounded-3xl border-transparent bg-brandForest p-5"
    >
      <View>
        <Row className="items-baseline">
          <Paragraph appear={false} className="text-[46px] font-semibold leading-[50px] text-onForest">
            {percent}
          </Paragraph>
          <Paragraph appear={false} className="text-xl font-semibold text-onForest">
            %
          </Paragraph>
        </Row>
        <Paragraph appear={false} className="text-sm font-normal text-onForest opacity-80">
          Bateria
        </Paragraph>
      </View>
      <BatteryGauge percent={percent} />
    </Card>
  )
}
