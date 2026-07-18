import { Pressable, View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { Paragraph } from '@/shared/components/ui'
import { BikeHero } from './components/bike-hero'
import { MotorCard } from './components/motor-card'
import { BatteryHealthCard } from './components/battery-health-card'
import { SpecsCard } from './components/specs-card'
import { MotoSkeleton } from './components/moto-skeleton'
import { NoBikeState } from './components/no-bike-state'
import { useMoto } from './hooks/use-moto'

/**
 * Motor view — the technical detail of the bike: identity + motor status + battery
 * health + spec sheet. The overview (photo, battery gauge, telemetry, location)
 * lives on the Home tab. UI only; data comes from useMoto() (mocked).
 */
export default function BikeScreen() {
  const { query, moto, onScanQr, linkingQr, onVincular, onUnlink } = useMoto()

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

            <MotorCard telemetry={moto.telemetry} delay={80} />

            <BatteryHealthCard battery={moto.battery} chargeTimeH={moto.specs.chargeTimeH} delay={120} />

            <SpecsCard specs={moto.specs} delay={160} />

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
