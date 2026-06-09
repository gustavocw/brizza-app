import { useRef } from 'react'
import { Pressable, View } from 'react-native'
import type MapView from 'react-native-maps'
import { Gps } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { ErrorBoundary } from '@/shared/components/error-boundary'
import { List, Paragraph } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { fontTheme, shadowsTheme } from '@/theme/theme'
import { StationsMap } from './components/stations-map'
import { MapFallback } from './components/map-fallback'
import { StationCard } from './components/station-card'
import { ChargeSkeleton } from './components/charge-skeleton'
import { useCharge } from './hooks/use-charge'
import type { ChargingStation } from './services/station.dto'

/**
 * Carregar view — UI only. Data + handlers come from useCharge() (mocked stations).
 * Map of nearby chargers up top (graceful fallback when the native map is absent),
 * scrollable station list below. Bottom padding clears the floating tab bar.
 */
export default function ChargeScreen() {
  const colors = useColors()
  const mapRef = useRef<MapView>(null)
  const { query, stations, userLocation, availableCount, onRoute } = useCharge()

  const focus = (latitude: number, longitude: number) =>
    mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 350)

  const onSelect = (s: ChargingStation) => focus(s.lat, s.lng)
  const onRecenter = () => focus(userLocation.latitude, userLocation.longitude)

  const subtitle = query.isPending
    ? 'Buscando estações por perto…'
    : `${stations.length} estações · ${availableCount} disponíveis agora`

  return (
    <Screen scroll={false} dismissKeyboardOnTap={false} contentClassName="gap-4 px-0 pt-1">
      <View className="px-4 pt-1">
        <Paragraph appear={false} className="text-muted">
          {subtitle}
        </Paragraph>
      </View>

      <View className="px-4">
        <View style={{ height: 260 }} className="overflow-hidden rounded-3xl bg-surfaceMuted">
          <ErrorBoundary fallback={<MapFallback />}>
            <StationsMap ref={mapRef} user={userLocation} stations={stations} onMarkerPress={onSelect} />
          </ErrorBoundary>

          {!query.isPending ? (
            <View
              style={shadowsTheme.sm}
              className="absolute left-3 top-3 flex-row items-center gap-1.5 rounded-full bg-surface px-3 py-1.5"
            >
              <View className="h-2 w-2 rounded-full bg-success" />
              <Paragraph appear={false} className="text-xs font-semibold text-foreground">
                {availableCount} disponíveis
              </Paragraph>
            </View>
          ) : null}

          <Pressable
            onPress={onRecenter}
            style={shadowsTheme.sm}
            className="absolute bottom-3 right-3 h-11 w-11 items-center justify-center rounded-full bg-surface"
            accessibilityRole="button"
            accessibilityLabel="Centralizar no meu local"
          >
            <Gps size={20} color={colors.primary} variant="Bold" />
          </Pressable>
        </View>
      </View>

      <View className="flex-1">
        <Paragraph
          appear={false}
          style={{ fontFamily: fontTheme.monoMedium }}
          className="px-5 pb-2 text-[11px] uppercase tracking-widest text-subtle"
        >
          Estações próximas
        </Paragraph>
        <QueryBoundary query={query} isEmpty={stations.length === 0} loading={<ChargeSkeleton />}>
          <List
            data={stations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <StationCard station={item} onPress={() => onSelect(item)} onRoute={() => onRoute(item)} />
            )}
            ItemSeparatorComponent={() => <View className="h-3" />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 2, paddingBottom: 140 }}
            onRefresh={query.refetch}
            refreshing={query.isRefetching}
          />
        </QueryBoundary>
      </View>
    </Screen>
  )
}
