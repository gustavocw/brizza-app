import { useState } from 'react'
import { View } from 'react-native'
import LottieView from 'lottie-react-native'
import { Keyboard } from 'iconsax-react-nativejs'
import { Button, Paragraph, Title } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { QrScanner } from './qr-scanner'

type Props = {
  onScan: (data: string) => void
  onManual: () => void
  linking: boolean
}

/**
 * No-bike state. The Lottie intro plays once and then hands off to the live QR
 * scanner (point at the bike's code to link). The manual entry button sits at the
 * bottom and routes to the plate form.
 */
export function NoBikeState({ onScan, onManual, linking }: Props) {
  const colors = useColors()
  const [scanning, setScanning] = useState(false)

  return (
    <View className="flex-1 px-5 pb-32 pt-8">
      <Title className="text-center text-[22px]">Nenhuma moto vinculada</Title>

      <View className="flex-1 items-center justify-center gap-5">
        {scanning ? (
          <>
            <QrScanner onScan={onScan} busy={linking} />
            <Paragraph appear={false} className="text-center text-muted">
              Aponte para o QR code da sua moto.
            </Paragraph>
          </>
        ) : (
          <LottieView
            autoPlay
            loop={false}
            onAnimationFinish={() => setScanning(true)}
            source={require('../../../../assets/lottie/qr-code.json')}
            style={{ width: 240, height: 240 }}
          />
        )}
      </View>

      <Button
        variant="secondary"
        label="Inserir placa manualmente"
        icon={<Keyboard size={20} color={colors.onPrimary} variant="Bold" />}
        onPress={onManual}
      />
    </View>
  )
}
