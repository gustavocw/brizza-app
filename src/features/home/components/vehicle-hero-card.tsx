import type { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'
import { Flash, Routing2 } from 'iconsax-react-nativejs'
import { Card } from '@/shared/components/ui/card'
import { Row } from '@/shared/components/ui/layout'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'
import { BatteryRing } from '@/shared/components/ui/battery-ring'
import { numberToBR } from '../utils/format'
import type { DashboardData } from '../services/dashboard.dto'

// Frosted-glass overlay on the deep-green card (white at low alpha). Brand colors
// all come from tokens; this is just a translucent white veil, like tokens.overlay.
const GLASS = { backgroundColor: 'rgba(255, 255, 255, 0.1)' }

const STATUS_LABEL: Record<DashboardData['battery']['status'], string> = {
  parked: 'Estacionada',
  moving: 'Em movimento',
  charging: 'Carregando',
}

function HeroStat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <Row className="gap-3">
      <View style={GLASS} className="h-9 w-9 items-center justify-center rounded-full">
        {icon}
      </View>
      <View className="flex-1">
        <Paragraph appear={false} className="text-base font-bold text-onPrimary">
          {value}
        </Paragraph>
        <Paragraph appear={false} className="text-xs text-onPrimary opacity-60">
          {label}
        </Paragraph>
      </View>
    </Row>
  )
}

type Props = {
  vehicle: DashboardData['vehicle']
  battery: DashboardData['battery']
  lastRoute: DashboardData['lastRoute']
  delay?: number
}

/** Dashboard centerpiece: vehicle + battery gauge + autonomy on a deep-green card. */
export function VehicleHeroCard({ vehicle, battery, lastRoute, delay = 0 }: Props) {
  const colors = useColors()

  return (
    <Card elevated delay={delay} className="overflow-hidden rounded-[32px] border-transparent bg-brandNight p-5">
      {/* accent glows fading into the brandNight base (replaces the deco circles) */}
      <Svg pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="heroGlowTR" cx="0.92" cy="0.06" r="0.7" gradientUnits="objectBoundingBox">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={0.55} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="heroGlowBL" cx="0.06" cy="0.96" r="0.6" gradientUnits="objectBoundingBox">
            <Stop offset="0" stopColor={colors.accent} stopOpacity={0.32} />
            <Stop offset="1" stopColor={colors.accent} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroGlowTR)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#heroGlowBL)" />
      </Svg>

      <Row className="items-start justify-between">
        <View>
          <Paragraph appear={false} style={{ fontFamily: fontTheme.monoMedium }} className="text-xs uppercase tracking-widest text-onPrimary opacity-70">
            {vehicle.model}
          </Paragraph>
          <Paragraph appear={false} style={{ fontFamily: fontTheme.mono }} className="text-[11px] text-onPrimary opacity-40">
            {vehicle.plate}
          </Paragraph>
        </View>
        <Row style={GLASS} className="gap-1.5 rounded-full px-3 py-1">
          <View className="h-1.5 w-1.5 rounded-full bg-accent" />
          <Paragraph appear={false} className="text-xs font-semibold text-onPrimary">
            {STATUS_LABEL[battery.status]}
          </Paragraph>
        </Row>
      </Row>

      <Row className="mt-5 items-center gap-5">
        <BatteryRing percent={battery.percent} size={118}>
          <Paragraph appear={false} className="text-[26px] font-bold text-onPrimary">
            {battery.percent}%
          </Paragraph>
          <Paragraph appear={false} className="text-[10px] uppercase tracking-wider text-onPrimary opacity-50">
            bateria
          </Paragraph>
        </BatteryRing>

        <View className="flex-1 gap-3">
          <HeroStat
            icon={<Flash size={18} color={colors.accent} variant="Bold" />}
            value={`${numberToBR(battery.autonomyKm)} km`}
            label="de autonomia"
          />
          <View className="h-px bg-onPrimary opacity-10" />
          <HeroStat
            icon={<Routing2 size={18} color={colors.accent} variant="Bold" />}
            value={`${numberToBR(lastRoute.distanceKm)} km`}
            label={`último trajeto · ${lastRoute.when}`}
          />
        </View>
      </Row>
    </Card>
  )
}
