import { Pressable, View } from 'react-native'
import { Flash, Send2 } from 'iconsax-react-nativejs'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { useColors } from '@/theme/use-colors'
import { fontTheme, shadowsTheme } from '@/theme/theme'
import { AvailabilityPill } from './availability-pill'
import { formatKm, formatPrice, type ChargingStation } from '../services/station.dto'

type Props = {
  station: ChargingStation
  onPress: () => void
  onRoute: () => void
}

/** One nearby station: charge chip, name/address, status + distance + price, and a route FAB. */
export function StationCard({ station, onPress, onRoute }: Props) {
  const colors = useColors()
  const dim = !station.is_open

  return (
    <Pressable onPress={onPress} style={shadowsTheme.sm} className="flex-row items-center gap-3 rounded-3xl bg-surface p-4">
      <View className="h-12 w-12 items-center justify-center rounded-2xl bg-secondarySoft">
        <Flash size={22} color={dim ? colors.subtle : colors.secondary} variant="Bold" />
      </View>

      <View className="flex-1">
        <Paragraph appear={false} numberOfLines={1} className="font-semibold text-foreground">
          {station.name}
        </Paragraph>
        <Paragraph appear={false} numberOfLines={1} className="mt-0.5 text-xs text-muted">
          {station.address}
        </Paragraph>
        <View className="mt-1.5 flex-row items-center gap-2">
          <AvailabilityPill station={station} />
          <View className="h-1 w-1 rounded-full bg-border" />
          <Paragraph appear={false} style={{ fontFamily: fontTheme.mono }} className="text-[11px] text-muted">
            {formatKm(station.distance_km)}
          </Paragraph>
          <View className="h-1 w-1 rounded-full bg-border" />
          <Paragraph appear={false} style={{ fontFamily: fontTheme.mono }} className="text-[11px] text-muted">
            {formatPrice(station.price_per_kwh)}
          </Paragraph>
        </View>
      </View>

      <Pressable
        onPress={onRoute}
        hitSlop={6}
        className="h-11 w-11 items-center justify-center rounded-full bg-primary"
        accessibilityRole="button"
        accessibilityLabel={`Traçar rota até ${station.name}`}
      >
        <Send2 size={20} color={colors.onPrimary} variant="Bold" />
      </Pressable>
    </Pressable>
  )
}
