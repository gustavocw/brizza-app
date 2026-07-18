import { Pressable, View } from 'react-native'
import { Heart } from 'iconsax-react-nativejs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'
import { CARD_BORDER } from '@/shared/constants/card-style'
import {
  availabilityLabel,
  formatPriceShort,
  formatRating,
  type ChargingStation,
} from '../services/station.dto'
import { StationPhoto } from './station-photo'

type Props = {
  station: ChargingStation
  favorite: boolean
  /** True while the in-app route is being fetched. */
  routing?: boolean
  onToggleFavorite: () => void
  onRoute: () => void
  onCharge: () => void
  onClose: () => void
}

function InfoColumn({ label, value, valueClass = 'text-secondary' }: { label: string; value: string; valueClass?: string }) {
  return (
    <View className="flex-1">
      <Paragraph appear={false} className="text-xs text-muted">
        {label}
      </Paragraph>
      <Paragraph appear={false} numberOfLines={1} className={`mt-0.5 text-sm font-semibold ${valueClass}`}>
        {value}
      </Paragraph>
    </View>
  )
}

/** Bottom card for the station picked on the map: street view, rating, price/slots/hours and actions. */
export function SelectedStationCard({ station, favorite, routing, onToggleFavorite, onRoute, onCharge, onClose }: Props) {
  const colors = useColors()
  const rating = formatRating(station.rating, station.reviewCount)

  return (
    <View style={CARD_BORDER} className="gap-4 rounded-3xl bg-surface p-4">
      {/* close FAB floats symmetric at the card corner (same gap top/right) */}
      <Pressable
        onPress={onClose}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Fechar"
        style={shadowsTheme.sm}
        className="absolute right-3 top-3 z-10 h-9 w-9 items-center justify-center rounded-full bg-surfaceMuted"
      >
        <MaterialCommunityIcons name="close" size={18} color={colors.muted} />
      </Pressable>

      <Row className="gap-3">
        <StationPhoto photoUrl={station.photoUrl} lat={station.lat} lng={station.lng} distanceKm={station.distance_km} size={84} />

        <View className="flex-1">
          <Paragraph appear={false} numberOfLines={2} className="pr-10 text-base font-semibold leading-5 text-foreground">
            {station.name}
          </Paragraph>
          <Paragraph appear={false} numberOfLines={1} className="mt-0.5 text-xs text-muted">
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
      </Row>

      <Row className="items-center gap-2 rounded-2xl bg-background px-4 py-3">
        <InfoColumn label="Preço" value={`${formatPriceShort(station.price_per_kwh)} kWh`} valueClass="text-primary" />
        <InfoColumn label="Vagas" value={`${station.available_slots} de ${station.total_slots}`} />
        <InfoColumn label="Horário" value={station.is_open ? (station.hours ?? '24h') : availabilityLabel(station)} />
        <Pressable
          onPress={onToggleFavorite}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Favoritar estação"
          accessibilityState={{ selected: favorite }}
          className="h-10 w-10 items-center justify-center rounded-full bg-surface"
          style={shadowsTheme.sm}
        >
          <Heart size={18} color={favorite ? colors.error : colors.subtle} variant={favorite ? 'Bold' : 'Linear'} />
        </Pressable>
      </Row>

      <Row className="gap-3">
        <Pressable
          onPress={onRoute}
          accessibilityRole="button"
          accessibilityLabel={`Traçar rota até ${station.name}`}
          className="h-12 flex-1 items-center justify-center rounded-full border border-border bg-surface"
        >
          <Paragraph appear={false} className="text-sm font-semibold text-foreground">
            {routing ? 'Traçando…' : 'Como chegar'}
          </Paragraph>
        </Pressable>
        <Pressable
          onPress={onCharge}
          accessibilityRole="button"
          accessibilityLabel="Iniciar carregamento"
          className="h-12 flex-1 items-center justify-center rounded-full bg-primary"
        >
          <Paragraph appear={false} className="text-sm font-semibold text-onPrimary">
            Carregar
          </Paragraph>
        </Pressable>
      </Row>
    </View>
  )
}
