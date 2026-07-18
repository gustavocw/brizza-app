import { Pressable, View } from 'react-native'
import { ArrowDown2 } from 'iconsax-react-nativejs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { Card, Paragraph, Row } from '@/shared/components/ui'
import { CARD_BORDER } from './components/card-style'
import { ScreenGradient } from './components/screen-gradient'
import { useColors } from '@/theme/use-colors'
import { fontTheme } from '@/theme/theme'
import { BatteryHealthCard } from './components/battery-health-card'
import { BatteryStatusCard } from './components/battery-status-card'
import { BikeCard } from './components/bike-card'
import { DashboardSkeleton } from './components/dashboard-skeleton'
import { HealthChecks } from './components/health-checks'
import { LocationCard } from './components/location-card'
import { MetricCard } from './components/metric-card'
import { MotorCard } from './components/motor-card'
import { SpecsCard } from './components/specs-card'
import { useHome } from './hooks/use-home'
import { numberToBR } from './utils/format'

/**
 * Dashboard view — the app's "overview": bike photo card, battery gauge, glanceable
 * metrics, quick actions, location and a health snapshot. Deep motor/spec detail
 * lives on the Motor tab. UI only; data + handlers come from useHome() (mocked).
 */
export default function HomeScreen() {
  const colors = useColors()
  const { query, location, onSelectBike, onCopyAddress } = useHome()
  const data = query.data

  return (
    <View className="flex-1">
      <ScreenGradient />
      <Screen className="bg-transparent" contentClassName="gap-6 px-4 pb-32 pt-1">
      <View>
        <Row className="items-center justify-between">
          <Pressable
            onPress={onSelectBike}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Trocar de moto"
          >
            <Row className="items-center gap-1.5">
              <Paragraph appear={false} className="text-xl font-semibold text-foreground">
                {data?.vehicle.model ?? 'Brizze'}
              </Paragraph>
              <ArrowDown2 size={18} color={colors.foreground} variant="Linear" />
            </Row>
          </Pressable>

          <Row className="items-center gap-1.5">
            <View className="h-2 w-2 rounded-full bg-accent" />
            <Paragraph appear={false} className="text-xs font-medium text-muted">
              Conectada
            </Paragraph>
          </Row>
        </Row>

        {data ? (
          <Paragraph appear={false} className="mt-0.5 text-xs font-medium text-muted">
            {data.vehicle.plate}
          </Paragraph>
        ) : null}
      </View>

      <QueryBoundary query={query} loading={<DashboardSkeleton />}>
        {data ? (
          <View className="gap-6">
            <BikeCard delay={60} />

            <BatteryStatusCard percent={data.battery.percent} delay={90} />

            <BatteryHealthCard
              healthPct={data.battery.healthPct}
              chargeCycles={data.battery.chargeCycles}
              chargeTimeH={data.specs.chargeTimeH}
              delay={110}
            />

            {location ? (
              <LocationCard
                delay={115}
                address={location.address}
                city={location.city}
                updatedAgo={location.updatedAgo}
                latitude={location.latitude}
                longitude={location.longitude}
                onCopy={onCopyAddress}
              />
            ) : null}

            <View className="gap-4">
              <Row className="gap-4">
                <MetricCard
                  delay={120}
                  label="Odômetro"
                  value={numberToBR(data.odometerKm)}
                  unit="km"
                  icon={<MaterialCommunityIcons name="counter" size={18} color={colors.primary} />}
                />
                <MetricCard
                  delay={140}
                  label="Autonomia estimada"
                  value={numberToBR(data.battery.autonomyKm)}
                  unit="km"
                  icon={<MaterialCommunityIcons name="map-marker-radius" size={18} color={colors.primary} />}
                />
              </Row>

              <Row className="gap-4">
                <MetricCard
                  delay={160}
                  label="Velocidade média"
                  value={`${data.avgSpeedKmh}`}
                  unit="km/h"
                  icon={<MaterialCommunityIcons name="speedometer" size={18} color={colors.primary} />}
                />
                <MetricCard
                  delay={180}
                  label="Economia de CO₂"
                  value={numberToBR(data.co2SavedKg)}
                  unit="kg"
                  icon={<MaterialCommunityIcons name="molecule-co2" size={18} color={colors.primary} />}
                />
              </Row>
            </View>

            <MotorCard state={data.motor.state} tempC={data.motor.tempC} delay={190} />

            <Card delay={200} style={CARD_BORDER} className="flex-row items-center gap-4 rounded-3xl bg-surface p-4">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primarySoft">
                <MaterialCommunityIcons name="wrench-clock" size={22} color={colors.primary} />
              </View>
              <View className="flex-1">
                <Paragraph
                  appear={false}
                  style={{ fontFamily: fontTheme.mono }}
                  className="text-[10px] uppercase tracking-wider text-subtle"
                >
                  Próxima revisão
                </Paragraph>
                <Paragraph appear={false} className="text-lg font-semibold text-secondary">
                  {numberToBR(data.nextService.km)} km ou {data.nextService.days} dias
                </Paragraph>
              </View>
            </Card>

            <SpecsCard specs={data.specs} delay={240} />

            <HealthChecks checks={data.checks} delay={260} />
          </View>
        ) : null}
      </QueryBoundary>
      </Screen>
    </View>
  )
}
