import { View } from 'react-native'
import { Flash, Setting2, Speedometer } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { Avatar, Button, Paragraph, Row, StatCard } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { DashboardSkeleton } from './components/dashboard-skeleton'
import { LocationCard } from './components/location-card'
import { VehicleHeroCard } from './components/vehicle-hero-card'
import { useHome } from './hooks/use-home'
import { numberToBR } from './utils/format'

/**
 * Dashboard view — UI only. Data + handlers come from useHome(). Everything is
 * mocked (see dashboard.service.ts). Bottom padding clears the floating tab bar.
 */
export default function HomeScreen() {
  const colors = useColors()
  const { query, location, userName, onChargeStations, onLocation } = useHome()
  const data = query.data

  return (
    <Screen contentClassName="gap-5 px-4 pb-32 pt-1">
      <Row className="items-center gap-3">
        <Avatar name={userName} size={46} />
        <View>
          <Paragraph appear={false} className="text-base font-semibold text-foreground">
            {userName}
          </Paragraph>
          <Row className="mt-0.5 gap-1.5">
            <View className="h-2 w-2 rounded-full bg-accent" />
            <Paragraph appear={false} className="text-xs font-medium text-muted">
              Conectada
            </Paragraph>
          </Row>
        </View>
      </Row>

      <QueryBoundary query={query} loading={<DashboardSkeleton />}>
        {data ? (
          <View className="gap-4">
            <VehicleHeroCard vehicle={data.vehicle} battery={data.battery} lastRoute={data.lastRoute} delay={60} />

            <Row className="gap-4">
              <StatCard
                delay={120}
                icon={<Setting2 size={20} color={colors.primary} variant="Bold" />}
                label="Motor"
                value={data.motor.state}
                sub={`${data.motor.tempC} °C`}
              />
              <StatCard
                delay={150}
                icon={<Speedometer size={20} color={colors.primary} variant="Bold" />}
                label="Rodados"
                value={`${numberToBR(data.odometerKm)} km`}
                sub="no total"
              />
            </Row>

            {location ? (
              <LocationCard
                delay={190}
                address={location.address}
                city={location.city}
                updatedAgo={location.updatedAgo}
                latitude={location.latitude}
                longitude={location.longitude}
                onPress={onLocation}
              />
            ) : null}

            <Button
              delay={230}
              label="Onde carregar"
              icon={<Flash size={20} color={colors.primary} variant="Bold" />}
              onPress={onChargeStations}
            />
          </View>
        ) : null}
      </QueryBoundary>
    </Screen>
  )
}
