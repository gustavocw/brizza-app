import { View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { useColors } from '@/theme/use-colors'

type Props = {
  model: string
  plate: string
}

/** Bottom-sheet body for switching bikes. Mock: one connected bike, already selected. */
export function BikeSwitcherSheet({ model, plate }: Props) {
  const colors = useColors()

  return (
    <View className="gap-4 px-5 pt-2">
      <View>
        <Paragraph appear={false} className="text-lg font-semibold text-foreground">
          Suas motos
        </Paragraph>
        <Paragraph appear={false} className="mt-0.5 text-xs text-muted">
          Toque para selecionar a moto que quer acompanhar.
        </Paragraph>
      </View>

      <View className="flex-row items-center gap-3 rounded-2xl border-2 border-primary bg-primarySoft p-4">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
          <MaterialCommunityIcons name="motorbike-electric" size={26} color={colors.onPrimary} />
        </View>
        <View className="flex-1">
          <Paragraph appear={false} className="font-semibold text-foreground">
            {model}
          </Paragraph>
          <Paragraph appear={false} className="text-xs text-muted">
            {plate} · Conectada
          </Paragraph>
        </View>
        <MaterialCommunityIcons name="check-circle" size={22} color={colors.primary} />
      </View>
    </View>
  )
}
