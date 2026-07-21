import { useEffect, useRef } from 'react'
import { Keyboard, Pressable, View } from 'react-native'
import type MapView from 'react-native-maps'
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Gps } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { ErrorBoundary } from '@/shared/components/error-boundary'
import { List, Paragraph } from '@/shared/components/ui'
import { MotoHeader } from '@/shared/components/moto/moto-header'
import { useHasNavButtons } from '@/shared/hooks/use-has-nav-buttons'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'
import { StationsMap } from './components/stations-map'
import { MapFallback } from './components/map-fallback'
import { SearchHeader } from './components/search-header'
import { SelectedStationCard } from './components/selected-station-card'
import { StationListCard } from './components/station-list-card'
import { ChargeSkeleton } from './components/charge-skeleton'
import { useCharge } from './hooks/use-charge'
import type { ChargingStation } from './services/station.dto'

/**
 * Carregar view — reference layout: search + map/list toggle up top, then either a
 * full-bleed map (distance pills; picking one raises the station card over the map)
 * or a card list. UI only; data + handlers come from useCharge() (mocked stations).
 */
export default function ChargeScreen() {
  const colors = useColors()
  const insets = useSafeAreaInsets()
  const hasNavButtons = useHasNavButtons()
  const mapRef = useRef<MapView>(null)
  const {
    query,
    stations,
    userLocation,
    coords,
    view,
    setView,
    search,
    setSearch,
    selectedStation,
    onSelectStation,
    onCloseStation,
    favorites,
    onToggleFavorite,
    route,
    routing,
    onRoute,
    onStartCharging,
  } = useCharge()

  const focus = (latitude: number, longitude: number) =>
    mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: 0.012, longitudeDelta: 0.012 }, 350)

  // The geocoded location resolves async; the mounted map ignores initialRegion
  // changes, so follow the null→coords transition once (unless the user picked
  // a station meanwhile).
  useEffect(() => {
    if (coords && !selectedStation) focus(coords.latitude, coords.longitude)
  }, [coords]) // eslint-disable-line react-hooks/exhaustive-deps

  // When the route lands, frame it whole (extra bottom padding clears the card).
  useEffect(() => {
    if (route && route.length > 1) {
      mapRef.current?.fitToCoordinates(route, {
        edgePadding: { top: 100, right: 60, bottom: 380, left: 60 },
        animated: true,
      })
    }
  }, [route])

  const onMarkerPress = (s: ChargingStation) => {
    Keyboard.dismiss()
    onSelectStation(s)
    focus(s.lat, s.lng)
  }

  const onMapPress = () => {
    Keyboard.dismiss()
    onCloseStation()
  }

  const onListCardPress = (s: ChargingStation) => {
    onSelectStation(s)
    setView('map')
  }

  const onRecenter = () => focus(userLocation.latitude, userLocation.longitude)

  // Clearance so the floating card/list end above the floating tab bar. Mirrors
  // the tab bar's own bottom margin so both lift together over Android's buttons.
  const tabClearance = insets.bottom + (hasNavButtons ? 16 : 2) + 80

  return (
    <Screen gradient scroll={false} dismissKeyboardOnTap={false} contentClassName="gap-4 px-0 pb-0 pt-1">
      <View className="gap-4 px-4">
        <MotoHeader />
        <SearchHeader search={search} onSearch={setSearch} view={view} onView={setView} />
      </View>

      {view === 'map' ? (
        <View className="flex-1 overflow-hidden rounded-t-3xl">
          <ErrorBoundary fallback={<MapFallback />}>
            <StationsMap
              ref={mapRef}
              center={selectedStation ? { latitude: selectedStation.lat, longitude: selectedStation.lng } : userLocation}
              centerZoomed={!!selectedStation}
              user={userLocation}
              stations={stations}
              selectedId={selectedStation?.id}
              route={route}
              onMarkerPress={onMarkerPress}
              onMapPress={onMapPress}
            />
          </ErrorBoundary>

          {query.isError ? (
            <View style={shadowsTheme.md} className="absolute inset-x-4 top-4 flex-row items-center gap-3 rounded-2xl bg-surface p-4">
              <Paragraph appear={false} className="flex-1 text-sm text-foreground">
                Não foi possível carregar as estações.
              </Paragraph>
              <Pressable onPress={() => query.refetch()} hitSlop={8} accessibilityRole="button" accessibilityLabel="Tentar de novo">
                <Paragraph appear={false} className="text-sm font-semibold text-primary">
                  Tentar de novo
                </Paragraph>
              </Pressable>
            </View>
          ) : null}

          {!query.isError && !query.isPending && stations.length === 0 ? (
            <View pointerEvents="none" className="absolute inset-x-0 top-4 items-center">
              <View style={shadowsTheme.sm} className="rounded-full bg-surface px-4 py-2">
                <Paragraph appear={false} className="text-xs font-medium text-muted">
                  Nenhuma estação encontrada
                </Paragraph>
              </View>
            </View>
          ) : null}

          {!query.isError ? (
            <Pressable
              onPress={onRecenter}
              style={shadowsTheme.sm}
              className="absolute right-4 top-4 h-11 w-11 items-center justify-center rounded-full bg-surface"
              accessibilityRole="button"
              accessibilityLabel="Centralizar no meu local"
            >
              <Gps size={20} color={colors.primary} variant="Bold" />
            </Pressable>
          ) : null}

          {selectedStation ? (
            <Animated.View
              entering={FadeInDown.springify().damping(16).stiffness(160)}
              exiting={FadeOutDown.duration(160)}
              className="absolute inset-x-4"
              style={{ bottom: tabClearance }}
            >
              <SelectedStationCard
                station={selectedStation}
                favorite={favorites.has(selectedStation.id)}
                routing={routing}
                onToggleFavorite={() => onToggleFavorite(selectedStation.id)}
                onRoute={() => onRoute(selectedStation)}
                onCharge={onStartCharging}
                onClose={onCloseStation}
              />
            </Animated.View>
          ) : null}
        </View>
      ) : (
        <View className="flex-1">
          <QueryBoundary query={query} isEmpty={stations.length === 0} loading={<ChargeSkeleton />}>
            <List
              data={stations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <StationListCard
                  station={item}
                  favorite={favorites.has(item.id)}
                  onPress={() => onListCardPress(item)}
                  onToggleFavorite={() => onToggleFavorite(item.id)}
                />
              )}
              ItemSeparatorComponent={() => <View className="h-3" />}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 2, paddingBottom: tabClearance + 16 }}
              onRefresh={query.refetch}
              refreshing={query.isRefetching}
            />
          </QueryBoundary>
        </View>
      )}
    </Screen>
  )
}
