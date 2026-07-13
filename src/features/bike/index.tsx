import { Pressable, View } from 'react-native'
import { Routing2, Setting2, Speedometer, Wind } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { Paragraph, Row, StatCard } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { BikeHero } from './components/bike-hero'
import { MotoActions } from './components/moto-actions'
import { BatteryCard } from './components/battery-card'
import { SpecsCard } from './components/specs-card'
import { LocationRow } from './components/location-row'
import { MotoSkeleton } from './components/moto-skeleton'
import { NoBikeState } from './components/no-bike-state'
import { numberToBR } from './services/bike.dto'
import { useMoto } from './hooks/use-moto'

/**
 * Moto view — UI only. Data + handlers come from useMoto() (mocked telemetry, like
 * the dashboard). Bike identity + battery + telemetry + spec sheet + location.
 * Bottom padding clears the floating tab bar.
 */
export default function BikeScreen() {
  const colors = useColors()
  const { query, moto, onScanQr, linkingQr, onVincular, onUnlink, onMap, onLocate, onLock, onHistory } = useMoto()

  return (
    <Screen contentClassName="gap-4 px-4 pb-32 pt-1">
      <QueryBoundary
        query={query}
        isEmpty={!moto}
        loading={<MotoSkeleton />}
        empty={<NoBikeState onScan={onScanQr} onManual={onVincular} linking={linkingQr} />}
      >
        {moto ? (
          <View className="gap-4">
            <BikeHero model={moto.model} plate={moto.plate} status={moto.status} lastSeen={moto.lastSeen} delay={40} />

            <MotoActions onLocate={onLocate} onLock={onLock} onHistory={onHistory} />

            <BatteryCard battery={moto.battery} delay={120} />

            <Row className="gap-4">
              <StatCard
                delay={160}
                icon={<Speedometer size={20} color={colors.secondary} variant="Bold" />}
                label="Odômetro"
                value={`${numberToBR(moto.telemetry.odometerKm)} km`}
                sub="no total"
              />
              <StatCard
                delay={180}
                icon={<Routing2 size={20} color={colors.secondary} variant="Bold" />}
                label="Última viagem"
                value={`${numberToBR(moto.telemetry.lastRouteKm)} km`}
                sub="hoje"
              />
            </Row>

            <Row className="gap-4">
              <StatCard
                delay={200}
                icon={<Wind size={20} color={colors.secondary} variant="Bold" />}
                label="Vel. média"
                value={`${moto.telemetry.avgSpeedKmh} km/h`}
              />
              <StatCard
                delay={220}
                icon={<Setting2 size={20} color={colors.secondary} variant="Bold" />}
                label="Motor"
                value={moto.telemetry.motorState}
                sub={`${moto.telemetry.motorTempC} °C`}
              />
            </Row>

            <SpecsCard specs={moto.specs} delay={260} />

            <LocationRow location={moto.location} onPress={onMap} delay={300} />

            <Pressable onPress={onUnlink} hitSlop={8} className="self-center px-4 py-1">
              <Paragraph appear={false} className="font-semibold text-error">
                Desvincular moto
              </Paragraph>
            </Pressable>
          </View>
        ) : null}
      </QueryBoundary>
    </Screen>
  )
}
