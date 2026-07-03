import { useState } from 'react'
import { Pressable, View } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeSlash, Lock, Trash } from 'iconsax-react-nativejs'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { Button } from '@/shared/components/ui/button'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Title } from '@/shared/components/ui/title'
import { Row } from '@/shared/components/ui/layout'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { useColors } from '@/theme/use-colors'
import { useDeleteAccount } from '../hooks/use-delete-account'

const schema = z.object({ password: z.string().min(1, 'Informe sua senha para confirmar') })
type Form = z.infer<typeof schema>

/**
 * Account-deletion confirmation (opened in a bottom sheet). Self-contained so the
 * destructive button reflects the live mutation state: the password is the
 * backend's anti-accident guard (DELETE /user/me requires it). A wrong password
 * keeps the sheet open with the global error toast; success wipes the session,
 * closes the sheet and lands on login.
 */
export function DeleteAccountSheet({ onClose }: { onClose: () => void }) {
  const colors = useColors()
  const toast = useToast()
  const nav = useNavigation()
  const del = useDeleteAccount()
  const [show, setShow] = useState(false)

  const { control, handleSubmit, formState } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { password: '' },
    mode: 'onChange',
  })

  const submit = handleSubmit(({ password }) =>
    del.mutate(password, {
      onSuccess: () => {
        onClose()
        nav.replace(nav.routes.public.signIn())
        toast.show({ message: 'Sua conta foi excluída.', type: 'success' })
      },
    }),
  )

  return (
    <View className="gap-5">
      <View className="gap-3">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-errorSoft">
          <Trash size={22} color={colors.error} variant="Bold" />
        </View>
        <Title className="text-xl">Excluir minha conta</Title>
        <Paragraph appear={false} className="text-muted">
          Esta ação é permanente. Sua conta é desativada agora e os seus dados são removidos em
          definitivo após 30 dias, conforme a LGPD. Para confirmar, digite sua senha.
        </Paragraph>
      </View>

      <ControlledTextField
        control={control}
        name="password"
        label="Senha"
        placeholder="Sua senha"
        secureTextEntry={!show}
        autoCapitalize="none"
        returnKeyType="go"
        onSubmitEditing={submit}
        left={<Lock size={18} color={colors.subtle} variant="Bold" />}
        right={
          <Pressable onPress={() => setShow((v) => !v)} hitSlop={8}>
            {show ? (
              <EyeSlash size={18} color={colors.subtle} variant="Bold" />
            ) : (
              <Eye size={18} color={colors.subtle} variant="Bold" />
            )}
          </Pressable>
        }
      />

      <Row className="gap-3">
        <View className="flex-1">
          <Button variant="secondary" appear={false} label="Cancelar" disabled={del.isPending} onPress={onClose} />
        </View>
        <View className="flex-1">
          <Button
            appear={false}
            className="bg-error"
            label="Excluir conta"
            isLoading={del.isPending}
            disabled={del.isPending || !formState.isValid}
            onPress={submit}
          />
        </View>
      </Row>
    </View>
  )
}
