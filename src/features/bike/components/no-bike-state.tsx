import { View } from 'react-native'
import { Button, Paragraph, Title } from '@/shared/components/ui'
import { MotoIcon } from '@/shared/components/navigation/moto-icon'
import { useColors } from '@/theme/use-colors'

/** Empty state when the user has no bike linked yet. */
export function NoBikeState({ onVincular }: { onVincular: () => void }) {
  const colors = useColors()
  return (
    <View className="flex-1 items-center justify-center gap-5 px-8 pb-16">
      <View className="h-24 w-24 items-center justify-center rounded-[28px] bg-primarySoft">
        <MotoIcon size={48} color={colors.primary} />
      </View>
      <View className="items-center gap-1.5">
        <Title className="text-center text-lg">Nenhuma moto vinculada</Title>
        <Paragraph appear={false} className="text-center text-muted">
          Vincule sua Minas Brisa para acompanhar bateria, localização e telemetria.
        </Paragraph>
      </View>
      <Button full={false} label="Vincular moto" onPress={onVincular} />
    </View>
  )
}
