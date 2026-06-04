import { StyleSheet, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'
import { mapStyle } from './map-style'

type Props = {
  latitude: number
  longitude: number
}

/**
 * Google map centered on the vehicle, with a branded marker. Gestures are off —
 * it is a preview; tapping the card (LocationCard) opens the full map.
 *
 * Needs the native build: set GOOGLE_MAPS_API_KEY in .env, then
 * `npx expo prebuild --clean && npm run ios|android`.
 */
export function MiniMap({ latitude, longitude }: Props) {
  const colors = useColors()

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={StyleSheet.absoluteFill}
      customMapStyle={mapStyle}
      initialRegion={{ latitude, longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 }}
      scrollEnabled={false}
      zoomEnabled={false}
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
  )
}
