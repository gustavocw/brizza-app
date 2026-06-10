import { View } from 'react-native'
import { Sms } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { ControlledPasswordField } from '@/shared/components/form/controlled-password-field'
import { BackButton, Button, Paragraph, Title } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { useUndelete } from './hooks/use-undelete'

/** Reactivate account view — UI only. POST /auth/undelete (e-mail/telefone + senha). Public. */
export default function UndeleteScreen() {
  const colors = useColors()
  const { control, onSubmit, isPending } = useUndelete()

  return (
    <Screen
      contentClassName="gap-5 px-4 pt-1"
      footer={<Button label="Reativar conta" isLoading={isPending} disabled={isPending} onPress={onSubmit} />}
    >
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Reativar conta
        </Title>
      </View>

      <View className="gap-4">
        <Paragraph appear={false} className="text-muted">
          Excluiu sua conta nos últimos 30 dias? Entre com suas credenciais para reativá-la.
        </Paragraph>
        <ControlledTextField
          control={control}
          name="identifier"
          label="E-mail ou telefone"
          placeholder="voce@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          left={<Sms size={18} color={colors.subtle} variant="Bold" />}
        />
        <ControlledPasswordField control={control} name="password" label="Senha" returnKeyType="go" onSubmitEditing={onSubmit} />
      </View>
    </Screen>
  )
}
