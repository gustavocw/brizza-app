import { useRef, useState } from 'react'
import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { Row } from '@/shared/components/ui'
import { MotoHeader } from '@/shared/components/moto/moto-header'
import { useColors } from '@/theme/use-colors'
// Sem fonte no backend até o BMS e o controlador entrarem na telemetria:
// import { BatteryHealthCard } from './components/battery-health-card'
// import { HealthChecks } from './components/health-checks'
// import { MotorCard } from './components/motor-card'
// import { SpecsCard } from './components/specs-card'
import { BatteryStatusCard } from './components/battery-status-card'
import { BikeCard } from './components/bike-card'
import { DashboardSkeleton } from './components/dashboard-skeleton'
import { LocationCard } from './components/location-card'
import { MetricCard } from './components/metric-card'
import { EmptyBike } from './components/empty-bike'
import { useHome } from './hooks/use-home'
import { numberToBR } from './utils/format'

/**
 * Painel inicial: foto da moto, bateria, métricas do rastreador e localização.
 * Só UI; os dados vêm de useHome(), que lê a API. Conta sem moto cai no
 * convite para vincular.
 */
export default function HomeScreen() {
  const colors = useColors()
  const { query, location, onCopyAddress } = useHome()
  const data = query.data

  // Keep the background white through the photo banner, then let the usual tints
  // start right after it — measure the banner's bottom in window coords.
  const bannerRef = useRef<View>(null)
  const [whiteHoldY, setWhiteHoldY] = useState(0)
  const measureBanner = () =>
    bannerRef.current?.measureInWindow((_x, y, _w, h) => {
      if (y + h > 0) setWhiteHoldY(y + h)
    })

  return (
    <Screen gradient gradientTopHold={whiteHoldY} contentClassName="gap-6 px-4 pb-32 pt-1">
      <MotoHeader />

      <QueryBoundary query={query} loading={<DashboardSkeleton />}>
        {data === null ? (
          <EmptyBike />
        ) : data ? (
          <View className="gap-6">
            <View ref={bannerRef} onLayout={measureBanner}>
              <BikeCard image={data.image} delay={60} />
            </View>

            <BatteryStatusCard percent={data.battery.percent} delay={90} />

            {/* Saúde da bateria e ciclos de carga dependem do BMS, que ainda não
                chega na telemetria:
            <BatteryHealthCard healthPct={...} chargeCycles={...} chargeTimeH={...} delay={110} /> */}

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
                  label="Velocidade atual"
                  value={`${data.speedKmh}`}
                  unit="km/h"
                  icon={<MaterialCommunityIcons name="speedometer" size={18} color={colors.primary} />}
                />
                <MetricCard
                  delay={180}
                  label="Viagem atual"
                  value={numberToBR(data.tripKm)}
                  unit="km"
                  icon={<MaterialCommunityIcons name="map-marker-path" size={18} color={colors.primary} />}
                />
                {/* Economia de CO₂ não existe no backend:
                <MetricCard delay={180} label="Economia de CO₂" value={...} unit="kg" /> */}
              </Row>
            </View>

            {/* Motor, próxima revisão, ficha técnica e checagens não têm fonte no
                backend (dependem do controlador e de um cadastro de modelos):
            <MotorCard state={...} tempC={...} delay={190} />
            <Card delay={200} ...>Próxima revisão</Card>
            <SpecsCard specs={...} delay={240} />
            <HealthChecks checks={...} delay={260} /> */}
          </View>
        ) : null}
      </QueryBoundary>
    </Screen>
  )
}
