import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledPasswordField } from '@/shared/components/form/controlled-password-field'
import { BackButton, Button, Paragraph, Title } from '@/shared/components/ui'
import { useChangePassword } from './hooks/use-change-password'

/**
 * Change-password view — UI only. Three password fields validated by zod
 * (new === confirm, min 8). PUT /user/me/password; the user is signed out after.
 */
export default function ChangePasswordScreen() {
  const { control, onSubmit, isPending, canSubmit } = useChangePassword()

  return (
    <Screen
      contentClassName="gap-5 px-4 pt-1"
      footer={<Button label="Alterar senha" isLoading={isPending} disabled={isPending || !canSubmit} onPress={onSubmit} />}
    >
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Alterar senha
        </Title>
      </View>

      <View className="gap-4">
        <ControlledPasswordField control={control} name="current_password" label="Senha atual" placeholder="Sua senha atual" />
        <ControlledPasswordField control={control} name="new_password" label="Nova senha" placeholder="Mínimo de 8 caracteres" />
        <ControlledPasswordField
          control={control}
          name="confirm"
          label="Confirmar nova senha"
          placeholder="Repita a nova senha"
          returnKeyType="go"
          onSubmitEditing={onSubmit}
        />

        <Paragraph appear={false} className="px-1 text-xs text-muted">
          Por segurança, você será desconectado e precisará entrar novamente.
        </Paragraph>
      </View>
    </Screen>
  )
}
