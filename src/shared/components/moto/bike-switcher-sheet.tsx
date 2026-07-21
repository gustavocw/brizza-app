import { Image, Pressable, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { STATUS, type MotoData } from '@/features/bike/services/bike.dto'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Row } from '@/shared/components/ui/layout'
import { useColors } from '@/theme/use-colors'

type Props = {
  bikes: MotoData[]
  selectedId: string
  onSelect: (id: string) => void
}

/** Bottom-sheet body for switching bikes: one tappable row per bike (photo, name,
 *  plate + status), the current one marked with a check. */
export function BikeSwitcherSheet({ bikes, selectedId, onSelect }: Props) {
  const colors = useColors()

  return (
    <View className="gap-3 px-5 pt-2">
      <View>
        <Paragraph appear={false} className="text-lg font-semibold text-foreground">
          Suas motos
        </Paragraph>
        <Paragraph appear={false} className="mt-0.5 text-xs text-muted">
          Toque para trocar a moto que você está acompanhando.
        </Paragraph>
      </View>

      <View className="gap-2">
        {bikes.map((b) => {
          const selected = b.id === selectedId
          const status = STATUS[b.status]
          return (
            <Pressable
              key={b.id}
              onPress={() => onSelect(b.id)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              className={`flex-row items-center gap-3 rounded-2xl border-2 p-3 ${
                selected ? 'border-primary bg-primarySoft' : 'border-transparent bg-surfaceMuted'
              }`}
            >
              <View className="h-14 w-24 overflow-hidden rounded-xl bg-surface">
                <Image source={b.image} resizeMode="contain" style={{ width: '100%', height: '100%' }} />
              </View>
              <View className="flex-1">
                <Paragraph appear={false} className="font-semibold text-foreground">
                  {b.model}
                </Paragraph>
                <Row className="mt-0.5 items-center gap-1.5">
                  <View className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  <Paragraph appear={false} className="text-xs text-muted">
                    {b.plate} · {status.label}
                  </Paragraph>
                </Row>
              </View>
              {selected ? (
                <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} />
              ) : (
                <View className="h-[22px] w-[22px] rounded-full border-2 border-border" />
              )}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
