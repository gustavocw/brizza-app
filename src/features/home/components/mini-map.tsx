import { useRef } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'
import { Gps } from 'iconsax-react-nativejs'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'
import { mapStyle } from '@/shared/constants/map-style'

type Props = {
  latitude: number
  longitude: number
}

/**
 * Google map centered on the vehicle, with a branded marker. Pan + zoom are on so
 * the user explores in place; nothing opens externally (toolbar off). A translucent
 * FAB recenters on the address if the user pans away and loses it.
 *
 * Needs the native build: set GOOGLE_MAPS_API_KEY in .env, then
 * `npx expo prebuild --clean && npm run ios|android`.
 */
export function MiniMap({ latitude, longitude }: Props) {
  const colors = useColors()
  const mapRef = useRef<MapView>(null)
  const region = { latitude, longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 }

  const recenter = () => mapRef.current?.animateToRegion(region, 400)

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        customMapStyle={mapStyle}
        initialRegion={region}
        scrollEnabled
        zoomEnabled
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        loadingEnabled
        loadingBackgroundColor={colors.surfaceMuted}
      >
        <Marker coordinate={{ latitude, longitude }} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <View
            style={[
              shadowsTheme.sm,
              { width: 22, height: 22, borderRadius: 11, borderWidth: 3, borderColor: colors.surface, backgroundColor: colors.accent },
            ]}
          />
        </Marker>
      </MapView>

      <Pressable
        onPress={recenter}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Centralizar no endereço"
        style={[shadowsTheme.sm, styles.fab]}
        className="h-9 w-9 items-center justify-center rounded-full"
      >
        <Gps size={18} color={colors.primary} variant="Bold" />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
})
