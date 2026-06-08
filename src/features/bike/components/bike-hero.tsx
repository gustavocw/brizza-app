import { StyleSheet, View } from 'react-native'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { MotoIcon } from '@/shared/components/navigation/moto-icon'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'
import { STATUS, type BikeStatusKind } from '../services/bike.dto'

const GLASS = { backgroundColor: 'rgba(255, 255, 255, 0.1)' }

type Props = {
  model: string
  plate: string
  status: BikeStatusKind
  lastSeen: string
  delay?: number
}

/** Bike identity on the deep-green brand surface: moto glyph + model/plate + status. */
export function BikeHero({ model, plate, status, lastSeen, delay = 0 }: Props) {
  const colors = useColors()
  const st = STATUS[status]

  return (
    <Card delay={delay} className="overflow-hidden rounded-[32px] border-transparent bg-brandNight p-5">
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="bikeGlowTR" cx="0.92" cy="0.05" r="0.7" gradientUnits="objectBoundingBox">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={0.5} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="bikeGlowBL" cx="0.05" cy="0.95" r="0.55" gradientUnits="objectBoundingBox">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={0.26} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#bikeGlowTR)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#bikeGlowBL)" />
      </Svg>

      <Row className="items-center gap-4">
        <View style={GLASS} className="h-16 w-16 items-center justify-center rounded-2xl">
          <MotoIcon size={38} color={colors.onPrimary} />
        </View>
        <View className="flex-1">
          <Paragraph
            appear={false}
            style={{ fontFamily: fontTheme.monoMedium }}
            className="text-sm uppercase tracking-widest text-onPrimary"
          >
            {model}
          </Paragraph>
          <Paragraph appear={false} style={{ fontFamily: fontTheme.mono }} className="text-[11px] text-onPrimary opacity-50">
            {plate}
          </Paragraph>
        </View>
        <Row style={GLASS} className="gap-1.5 rounded-full px-3 py-1">
          <View className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
          <Paragraph appear={false} className="text-xs font-semibold text-onPrimary">
            {st.label}
          </Paragraph>
        </Row>
      </Row>

      <Paragraph appear={false} className="mt-4 text-xs text-onPrimary opacity-60">
        Vista {lastSeen} · conectada
      </Paragraph>
    </Card>
  )
}
