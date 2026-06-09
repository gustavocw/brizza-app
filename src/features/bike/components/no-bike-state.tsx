import { View } from 'react-native'
import LottieView from 'lottie-react-native'
import { Scan } from 'iconsax-react-nativejs'
import { Button, Paragraph, Title } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'

/** Empty state when the user has no bike linked yet. */
export function NoBikeState({ onVincular }: { onVincular: () => void }) {
  const colors = useColors()
  return (
    <View className="flex-1 items-center justify-center gap-5 px-8 pb-16">
      <LottieView
        autoPlay
        loop
        source={require('../../../../assets/lottie/qr-code.json')}
        style={{ width: 180, height: 180 }}
      />
      <View className="items-center gap-1.5">
        <Title className="text-center text-lg">Nenhuma moto vinculada</Title>
        <Paragraph appear={false} className="text-center text-muted">
          Vincule sua Minas Brisa para acompanhar bateria, localização e telemetria.
        </Paragraph>
      </View>
      <View className="w-full px-2 pt-1">
        <Button label="Vincular moto" icon={<Scan size={20} color={colors.primary} variant="Bold" />} onPress={onVincular} />
      </View>
    </View>
  )
}
