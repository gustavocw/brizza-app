import { forwardRef } from 'react'
import { StyleSheet, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'
import { mapStyle } from '@/shared/constants/map-style'
import type { Availability, ChargingStation, LatLng } from '../services/station.dto'

// Solid colored dot (no SVG): a Marker with tracksViewChanges={false} snapshots
// its child once, and an icon may not be painted yet — a plain View always is.
function StationPin({ availability }: { availability: Availability }) {
  const colors = useColors()
  const bg =
    availability === 'available' ? colors.success : availability === 'busy' ? colors.warning : colors.subtle
  return (
    <View
      style={[
        shadowsTheme.sm,
        { width: 24, height: 24, borderRadius: 12, borderWidth: 4, borderColor: colors.surface, backgroundColor: bg },
      ]}
    />
  )
}

type Props = {
  user: LatLng
  stations: ChargingStation[]
  onMarkerPress: (station: ChargingStation) => void
}

/**
 * Google map of nearby charging stations. Pins are colored by availability; the
 * user sits under an accent dot. Needs the native build (set GOOGLE_MAPS_API_KEY,
 * then `npx expo prebuild --clean && npm run ios|android`); in Expo Go the parent
 * ErrorBoundary swaps in MapFallback.
 */
export const StationsMap = forwardRef<MapView, Props>(function StationsMap({ user, stations, onMarkerPress }, ref) {
  const colors = useColors()

  return (
    <MapView
      ref={ref}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFill}
      customMapStyle={mapStyle}
      initialRegion={{ ...user, latitudeDelta: 0.05, longitudeDelta: 0.05 }}
      toolbarEnabled={false}
      loadingEnabled
      loadingBackgroundColor={colors.surfaceMuted}
    >
      <Marker coordinate={user} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
        <View
          style={[
            shadowsTheme.sm,
            { width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: colors.surface, backgroundColor: colors.accent },
          ]}
        />
      </Marker>

      {stations.map((s) => (
        <Marker
          key={s.id}
          coordinate={{ latitude: s.lat, longitude: s.lng }}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}
          onPress={() => onMarkerPress(s)}
        >
          <StationPin availability={s.availability} />
        </Marker>
      ))}
    </MapView>
  )
})
