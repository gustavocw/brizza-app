import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { BackButton, Button, Paragraph, Title } from '@/shared/components/ui'
import { QrScanner } from './components/qr-scanner'
import { useLinkBike } from './hooks/use-link-bike'

/**
 * Vincular moto. O caminho normal é escanear o QR colado na moto (ele carrega o
 * IMEI do rastreador). A placa fica como alternativa para etiqueta danificada.
 */
export default function LinkBikeScreen() {
  const { control, onSubmit, isPending, scannerOpen, openScanner, closeScanner, onScanned } = useLinkBike()

  return (
    <Screen
      contentClassName="gap-5 px-4 pt-1"
      footer={
        scannerOpen ? (
          <Button label="Digitar a placa" variant="ghost" onPress={closeScanner} />
        ) : (
          <Button label="Vincular moto" isLoading={isPending} disabled={isPending} onPress={onSubmit} />
        )
      }
    >
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Vincular moto
        </Title>
      </View>

      {scannerOpen ? (
        <View className="items-center gap-4">
          <Paragraph appear={false} className="text-center text-muted">
            Aponte para o QR code colado na sua moto.
          </Paragraph>
          <QrScanner onScan={onScanned} busy={isPending} />
        </View>
      ) : (
        <View className="gap-4">
          <Paragraph appear={false} className="text-muted">
            Escaneie o QR code colado na sua moto. Se a etiqueta estiver danificada, informe a placa.
          </Paragraph>
          <Button label="Escanear QR code" onPress={openScanner} disabled={isPending} />
          <ControlledTextField
            control={control}
            name="plate"
            label="Placa"
            placeholder="ABC1D23"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
          />
          <ControlledTextField
            control={control}
            name="model"
            label="Modelo (opcional)"
            placeholder="GoBrisa Volt 110"
            returnKeyType="go"
            onSubmitEditing={onSubmit}
          />
        </View>
      )}
    </Screen>
  )
}
