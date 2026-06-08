import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { BackButton, Button, Paragraph, Title } from '@/shared/components/ui'
import { useChangeContact } from './hooks/use-change-contact'

/**
 * Change email/phone view — UI only. Two phases: enter the new value, then confirm
 * with the 6-digit code. Driven by the `kind` route param.
 */
export default function ChangeContactScreen() {
  const { config, phase, value, requestControl, onRequest, requesting, confirmControl, onConfirm, confirming, onBack } =
    useChangeContact()

  return (
    <Screen contentClassName="gap-5 px-4 pt-1">
      <View className="flex-row items-center gap-3">
        <BackButton onPress={onBack} />
        <Title numberOfLines={1} className="flex-1 text-xl">
          {config.title}
        </Title>
      </View>

      {phase === 'request' ? (
        <View className="gap-4">
          <Paragraph appear={false} className="text-muted">
            Informe o novo valor e enviaremos um código de confirmação.
          </Paragraph>
          <ControlledTextField
            control={requestControl}
            name="value"
            label={config.label}
            placeholder={config.placeholder}
            keyboardType={config.keyboardType}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={onRequest}
          />
          <Button label="Enviar código" isLoading={requesting} disabled={requesting} onPress={onRequest} />
        </View>
      ) : (
        <View className="gap-4">
          <Paragraph appear={false} className="text-muted">
            Enviamos um código de 6 dígitos para {value}. Digite-o para confirmar.
          </Paragraph>
          <ControlledTextField
            control={confirmControl}
            name="code"
            label="Código"
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            returnKeyType="go"
            onSubmitEditing={onConfirm}
          />
          <Button label="Confirmar" isLoading={confirming} disabled={confirming} onPress={onConfirm} />
        </View>
      )}
    </Screen>
  )
}
