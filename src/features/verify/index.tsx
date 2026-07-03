import { Pressable, View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { BackButton, Button, Paragraph, Title } from '@/shared/components/ui'
import { maskCode } from '@/shared/utils/masks'
import { useVerify } from './hooks/use-verify'

/**
 * Verify e-mail/phone view — UI only. A code is sent on open; enter it to confirm.
 * Driven by the `kind` route param.
 */
export default function VerifyScreen() {
  const { config, control, onConfirm, confirming, canConfirm, onResend } = useVerify()

  return (
    <Screen
      contentClassName="gap-5 px-4 pt-1"
      footer={<Button label="Confirmar" isLoading={confirming} disabled={confirming || !canConfirm} onPress={onConfirm} />}
    >
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          {config.title}
        </Title>
      </View>

      <View className="gap-4">
        <Paragraph appear={false} className="text-muted">
          Enviamos um código de 6 dígitos para {config.target}. Digite-o abaixo para confirmar.
        </Paragraph>
        <ControlledTextField
          control={control}
          name="code"
          label="Código"
          placeholder="000000"
          keyboardType="number-pad"
          mask={maskCode}
          returnKeyType="go"
          onSubmitEditing={onConfirm}
        />
        <Pressable onPress={onResend} hitSlop={8} className="self-start">
          <Paragraph appear={false} className="font-medium text-primary">
            Reenviar código
          </Paragraph>
        </Pressable>
      </View>
    </Screen>
  )
}
