import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Button, Card, Paragraph } from '@/shared/components/ui'
import { CARD_BORDER } from '@/shared/constants/card-style'
import { routes } from '@/shared/constants/routes'
import { useColors } from '@/theme/use-colors'

/** Conta sem moto vinculada: é o caminho para o leitor de QR. */
export function EmptyBike() {
  const colors = useColors()
  const router = useRouter()

  return (
    <Card style={CARD_BORDER} className="items-center gap-3 rounded-3xl bg-surface p-6">
      <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primarySoft">
        <MaterialCommunityIcons name="motorbike" size={28} color={colors.primary} />
      </View>
      <Paragraph appear={false} className="text-center text-lg font-semibold text-foreground">
        Nenhuma moto vinculada
      </Paragraph>
      <Paragraph appear={false} className="text-center text-sm text-muted">
        Escaneie o QR code colado na sua moto para acompanhar bateria, autonomia e localização.
      </Paragraph>
      <Button className="mt-2 w-full" onPress={() => router.push(routes.private.linkBike())}>
        Vincular moto
      </Button>
    </Card>
  )
}
