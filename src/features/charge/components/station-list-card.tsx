import { Pressable, View } from 'react-native'
import { Heart } from 'iconsax-react-nativejs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { CARD_BORDER } from '@/shared/constants/card-style'
import { formatRating, type ChargingStation } from '../services/station.dto'
import { StationPhoto } from './station-photo'

type Props = {
  station: ChargingStation
  favorite: boolean
  onPress: () => void
  onToggleFavorite: () => void
}

/** One station in list view: photo + distance badge, name, address, rating, favorite. */
export function StationListCard({ station, favorite, onPress, onToggleFavorite }: Props) {
  const colors = useColors()
  const rating = formatRating(station.rating, station.reviewCount)

  return (
    <Pressable onPress={onPress} style={CARD_BORDER} className="flex-row gap-3 rounded-3xl bg-surface p-3">
      <StationPhoto photoUrl={station.photoUrl} lat={station.lat} lng={station.lng} distanceKm={station.distance_km} size={96} />

      <View className="flex-1 py-1">
        <Row className="items-start gap-2">
          <Paragraph appear={false} numberOfLines={2} className="flex-1 text-base font-semibold leading-5 text-foreground">
            {station.name}
          </Paragraph>
          <Pressable
            onPress={onToggleFavorite}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Favoritar estação"
            accessibilityState={{ selected: favorite }}
          >
            <Heart size={20} color={favorite ? colors.error : colors.subtle} variant={favorite ? 'Bold' : 'Linear'} />
          </Pressable>
        </Row>
        <Paragraph appear={false} numberOfLines={2} className="mt-1 text-xs leading-4 text-muted">
          {station.address}
        </Paragraph>
        {rating ? (
          <Row className="mt-1.5 items-center gap-1">
            <MaterialCommunityIcons name="star" size={14} color={colors.warning} />
            <Paragraph appear={false} className="text-xs font-medium text-foreground">
              {rating}
            </Paragraph>
          </Row>
        ) : null}
      </View>
    </Pressable>
  )
}
