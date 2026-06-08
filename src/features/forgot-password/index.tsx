import { View } from 'react-native'
import { Sms } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { ControlledPasswordField } from '@/shared/components/form/controlled-password-field'
import { BackButton, Button, Paragraph, Title } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { useForgotPassword } from './hooks/use-forgot-password'

/**
 * Forgot-password view — UI only. Two phases: request a code, then reset the
 * password with the 6-digit code. Endpoints are public (no auth).
 */
export default function ForgotPasswordScreen() {
  const colors = useColors()
  const { phase, identifier, requestControl, onRequest, requesting, resetControl, onReset, resetting, onBack } =
    useForgotPassword()

  return (
    <Screen contentClassName="gap-5 px-4 pt-1">
      <View className="flex-row items-center gap-3">
        <BackButton onPress={onBack} />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Recuperar senha
        </Title>
      </View>

      {phase === 'request' ? (
        <View className="gap-4">
          <Paragraph appear={false} className="text-muted">
            Informe seu e-mail ou telefone e enviaremos um código de verificação.
          </Paragraph>
          <ControlledTextField
            control={requestControl}
            name="identifier"
            label="E-mail ou telefone"
            placeholder="voce@email.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="go"
            onSubmitEditing={onRequest}
            left={<Sms size={18} color={colors.subtle} variant="Bold" />}
          />
          <Button label="Enviar código" isLoading={requesting} disabled={requesting} onPress={onRequest} />
        </View>
      ) : (
        <View className="gap-4">
          <Paragraph appear={false} className="text-muted">
            Enviamos um código de 6 dígitos para {identifier}. Digite o código e escolha uma nova senha.
          </Paragraph>
          <ControlledTextField
            control={resetControl}
            name="code"
            label="Código"
            placeholder="000000"
            keyboardType="number-pad"
            maxLength={6}
            returnKeyType="next"
          />
          <ControlledPasswordField
            control={resetControl}
            name="new_password"
            label="Nova senha"
            placeholder="Mínimo de 8 caracteres"
          />
          <ControlledPasswordField
            control={resetControl}
            name="confirm"
            label="Confirmar senha"
            placeholder="Repita a nova senha"
            returnKeyType="go"
            onSubmitEditing={onReset}
          />
          <Button label="Redefinir senha" isLoading={resetting} disabled={resetting} onPress={onReset} />
        </View>
      )}
    </Screen>
  )
}
