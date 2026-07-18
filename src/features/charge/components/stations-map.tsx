import { forwardRef, useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from 'react-native-reanimated'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useColors } from '@/theme/use-colors'
import { fontTheme, shadowsTheme } from '@/theme/theme'
import { mapStyle } from '@/shared/constants/map-style'
import { availabilityOf, formatKm, type Availability, type ChargingStation, type LatLng } from '../services/station.dto'

/**
 * Distance balloon, reference style: bolt in a light chip + distance text, with a
 * crisp triangular tail pointing at the location. Colored by availability — vivid
 * green available, mustard busy, navy offline. The NEAREST station renders bigger
 * (emphasized), and the selected one also gains a white ring.
 * (The MCI font is loaded at app start by the tab bar, so the Marker snapshot —
 * tracksViewChanges={false} — is safe; Montserrat is gated at the root.)
 */
function StationPill({
  label,
  availability,
  emphasized,
}: {
  label: string
  availability: Availability
  emphasized: boolean
}) {
  const colors = useColors()
  // Two-color scheme on purpose: green = available, mustard = unavailable
  // (busy OR closed) — no navy on the map.
  const tone: Record<Availability, { bg: string; fg: string }> = {
    available: { bg: colors.accent, fg: colors.onAccent },
    busy: { bg: colors.warning, fg: colors.onWarning },
    offline: { bg: colors.warning, fg: colors.onWarning },
  }
  const { bg, fg } = tone[availability]
  const chip = emphasized ? 26 : 22

  return (
    <View className="items-center">
      <View
        style={[shadowsTheme.sm, { backgroundColor: bg }]}
        className={`flex-row items-center rounded-full ${emphasized ? 'gap-2 px-3.5 py-2.5' : 'gap-1.5 px-3 py-2'}`}
      >
        <View
          style={{ width: chip, height: chip, backgroundColor: colors.surface }}
          className="items-center justify-center rounded-full"
        >
          <MaterialCommunityIcons name="flash" size={emphasized ? 15 : 13} color={bg} />
        </View>
        <Text style={{ fontFamily: fontTheme.bold, fontSize: emphasized ? 14 : 13, color: fg }}>{label}</Text>
      </View>
      {/* tail — a border-trick triangle, so the point stays crisp */}
      <View
        style={{
          width: 0,
          height: 0,
          marginTop: -1,
          borderLeftWidth: 7,
          borderRightWidth: 7,
          borderTopWidth: 9,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: bg,
        }}
      />
    </View>
  )
}

/**
 * One station marker with a pop-in. Map markers are native snapshots, so the
 * animation only shows while tracksViewChanges is true — we keep it on for the
 * spring's duration, then freeze the snapshot for performance. A small per-index
 * delay staggers the balloons as they appear.
 */
function StationMarker({
  station,
  emphasized,
  index,
  onPress,
}: {
  station: ChargingStation
  emphasized: boolean
  index: number
  onPress: (s: ChargingStation) => void
}) {
  const [tracking, setTracking] = useState(true)
  const scale = useSharedValue(0)

  useEffect(() => {
    scale.value = withDelay(index * 45, withSpring(1, { damping: 12, stiffness: 170, mass: 0.7 }))
    const t = setTimeout(() => setTracking(false), 750 + index * 45)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const style = useAnimatedStyle(() => ({ opacity: scale.value, transform: [{ scale: scale.value }] }))

  return (
    <Marker
      coordinate={{ latitude: station.lat, longitude: station.lng }}
      // The balloon tail points at the location, so anchor bottom-center.
      anchor={{ x: 0.5, y: 1 }}
      tracksViewChanges={tracking}
      onPress={(e) => {
        e.stopPropagation()
        onPress(station)
      }}
    >
      <Animated.View style={style}>
        <StationPill label={formatKm(station.distance_km)} availability={availabilityOf(station)} emphasized={emphasized} />
      </Animated.View>
    </Marker>
  )
}

type Props = {
  center: LatLng
  /** Tighter initial zoom (used when `center` is a selected station). */
  centerZoomed?: boolean
  user: LatLng
  stations: ChargingStation[]
  selectedId?: string | null
  /** Driving route to the selected station (drawn in-app, Google Maps style). */
  route?: LatLng[] | null
  onMarkerPress: (station: ChargingStation) => void
  onMapPress?: () => void
}

/**
 * Google map of nearby charging stations, reference style: each station is a
 * distance pill (navy; green when selected), the user sits under an accent dot.
 * Tapping empty map clears the selection. Needs the native build (set
 * GOOGLE_MAPS_API_KEY, then `npx expo prebuild --clean && npm run ios|android`);
 * in Expo Go the parent ErrorBoundary swaps in MapFallback.
 */
export const StationsMap = forwardRef<MapView, Props>(function StationsMap(
  { center, centerZoomed, user, stations, selectedId, route, onMarkerPress, onMapPress },
  ref,
) {
  const colors = useColors()
  const delta = centerZoomed ? 0.012 : 0.03
  // The closest station gets the bigger balloon, reference style.
  const nearestId = stations.length
    ? stations.reduce((min, s) => (s.distance_km < min.distance_km ? s : min)).id
    : null

  return (
    <MapView
      ref={ref}
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFill}
      customMapStyle={mapStyle}
      initialRegion={{ ...center, latitudeDelta: delta, longitudeDelta: delta }}
      toolbarEnabled={false}
      // The JS animateToRegion is the only camera driver — otherwise Android also
      // runs its native center-on-marker animation and the two fight visibly.
      moveOnMarkerPress={false}
      loadingEnabled
      loadingBackgroundColor={colors.surfaceMuted}
      // Marker taps bubble a map press on some versions; the action guard keeps
      // deselect strictly for empty-map taps (belt to the stopPropagation braces).
      onPress={(e) => {
        if (e.nativeEvent.action !== 'marker-press') onMapPress?.()
      }}
    >
      {route && route.length > 1 ? (
        <Polyline coordinates={route} strokeColor={colors.primary} strokeWidth={4} lineCap="round" lineJoin="round" />
      ) : null}

      <Marker coordinate={user} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
        <View
          style={[
            shadowsTheme.sm,
            { width: 20, height: 20, borderRadius: 10, borderWidth: 3, borderColor: colors.surface, backgroundColor: colors.accent },
          ]}
        />
      </Marker>

      {stations.map((s, i) => {
        const selected = s.id === selectedId
        const emphasized = selected || s.id === nearestId
        // Emphasis restyles the pill; the key remount forces a fresh snapshot
        // (and re-plays the pop for the newly emphasized/selected balloon).
        return (
          <StationMarker key={`${s.id}-${emphasized}`} station={s} emphasized={emphasized} index={i} onPress={onMarkerPress} />
        )
      })}
    </MapView>
  )
})
