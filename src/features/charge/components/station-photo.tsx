import { Image, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { useColors } from '@/theme/use-colors'
import { ENV } from '@/shared/constants/env'
import { formatKm } from '../services/station.dto'

type Props = {
  photoUrl?: string
  /** Station coords — when present (and the Maps key is set), shows the Street View of the spot. */
  lat?: number
  lng?: number
  distanceKm?: number
  size: number
}

/**
 * Station thumbnail: an icon tile underneath and the image layered on top — the
 * Street View of the location when available (return_error_code makes Google 404
 * instead of serving a gray "no imagery" tile, so the fallback shows), else the
 * mock photo. Optional distance badge in the corner, reference style.
 */
export function StationPhoto({ photoUrl, lat, lng, distanceKm, size }: Props) {
  const colors = useColors()

  const streetViewUrl =
    lat != null && lng != null && ENV.googleMapsApiKey
      ? `https://maps.googleapis.com/maps/api/streetview?size=240x240&location=${lat},${lng}&fov=80&return_error_code=true&key=${ENV.googleMapsApiKey}`
      : null
  const uri = streetViewUrl ?? photoUrl

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center overflow-hidden rounded-2xl bg-primarySoft">
      <MaterialCommunityIcons name="ev-station" size={size * 0.4} color={colors.primary} />
      {uri ? <Image source={{ uri }} resizeMode="cover" style={StyleSheet.absoluteFill} /> : null}

      {distanceKm != null ? (
        <View
          style={{ backgroundColor: colors.overlay }}
          className="absolute bottom-1.5 left-1.5 flex-row items-center gap-1 rounded-full px-2 py-0.5"
        >
          <MaterialCommunityIcons name="flash" size={10} color={colors.onSecondary} />
          <Paragraph appear={false} className="text-[10px] font-semibold text-onSecondary">
            {formatKm(distanceKm)}
          </Paragraph>
        </View>
      ) : null}
    </View>
  )
}
