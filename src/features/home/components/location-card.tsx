import { Pressable, View } from 'react-native'
import { ArrowRight2, Location } from 'iconsax-react-nativejs'
import { Card } from '@/shared/components/ui/card'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { useColors } from '@/theme/use-colors'
import { shadowsTheme } from '@/theme/theme'
import { MiniMap } from './mini-map'

type Props = {
  address: string
  city: string
  updatedAgo: string
  latitude: number
  longitude: number
  onPress: () => void
  delay?: number
}

/** Vehicle location: the Google map fills the card and the address floats over it. */
export function LocationCard({ address, city, updatedAgo, latitude, longitude, onPress, delay = 0 }: Props) {
  const colors = useColors()

  return (
    <Card elevated delay={delay} className="rounded-3xl border-transparent p-0">
      <View style={{ height: 210 }} className="overflow-hidden rounded-3xl border-2 border-surface">
        <MiniMap latitude={latitude} longitude={longitude} />

        <Pressable
          onPress={onPress}
          style={shadowsTheme.md}
          className="absolute inset-x-3 bottom-3 flex-row items-center gap-3 rounded-2xl bg-surface p-3"
        >
          {/* neutral location chip — the accent arrow gets the focus */}
          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-surfaceMuted">
            <Location size={20} color={colors.muted} variant="Bold" />
          </View>
          <View className="flex-1">
            <Paragraph appear={false} className="font-semibold text-foreground">
              {address}
            </Paragraph>
            <Paragraph appear={false} className="text-xs text-muted">
              {city} · atualizado {updatedAgo}
            </Paragraph>
          </View>
          {/* brand-green FAB with a chevron — same green as the CTA button */}
          <View className="h-11 w-11 items-center justify-center rounded-full bg-primary">
            <ArrowRight2 size={20} color={colors.onPrimary} variant="Linear" />
          </View>
        </Pressable>
      </View>
    </Card>
  )
}
