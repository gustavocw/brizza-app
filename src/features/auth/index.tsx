import { Pressable, View } from 'react-native'
import { Eye, EyeSlash, Lock, User } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { Appear, Button, Paragraph, Title } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { AppleIcon, GoogleIcon } from './components/brand-icons'
import { BrandMark } from './components/brand-mark'
import { useSignIn } from './hooks/use-sign-in'

/**
 * Login view — UI only. Behavior lives in useSignIn(). Real login by e-mail or
 * telefone + senha (Brizza API). Google/Apple are placeholders for now. Inside
 * <Screen>, so the keyboard never covers the inputs and tapping outside dismisses it.
 */
export default function SignInScreen() {
  const colors = useColors()
  const { control, showPassword, togglePassword, onSubmit, onGoogle, onApple, onForgotPassword, onRegister, onUndelete, isPending, showApple } =
    useSignIn()

  return (
    <Screen contentClassName="gap-6 px-6 py-4">
      <Appear className="items-center gap-4 pb-2 pt-8">
        <BrandMark />
        <View className="items-center gap-1">
          <Title appear={false} className="text-[26px]">
            Bem-vindo de volta
          </Title>
          <Paragraph appear={false} className="text-muted">
            Acesse sua conta Minas Brisa
          </Paragraph>
        </View>
      </Appear>

      <Appear delay={90} className="gap-4">
        <ControlledTextField
          control={control}
          name="identifier"
          label="E-mail ou telefone"
          placeholder="voce@email.com"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          returnKeyType="next"
          left={<User size={18} color={colors.subtle} variant="Bold" />}
        />
        <ControlledTextField
          control={control}
          name="password"
          label="Senha"
          placeholder="Sua senha"
          secureTextEntry={!showPassword}
          returnKeyType="go"
          onSubmitEditing={onSubmit}
          left={<Lock size={18} color={colors.subtle} variant="Bold" />}
          right={
            <Pressable onPress={togglePassword} hitSlop={8}>
              {showPassword ? (
                <EyeSlash size={18} color={colors.subtle} variant="Bold" />
              ) : (
                <Eye size={18} color={colors.subtle} variant="Bold" />
              )}
            </Pressable>
          }
        />
        <Pressable onPress={onForgotPassword} hitSlop={8} className="self-end">
          <Paragraph appear={false} className="font-medium text-primary">
            Esqueci a senha
          </Paragraph>
        </Pressable>
        <Button label="Entrar" appear={false} isLoading={isPending} disabled={isPending} onPress={onSubmit} />
      </Appear>

      <Appear delay={150} className="flex-row items-center gap-3">
        <View className="h-px flex-1 bg-divider" />
        <Paragraph appear={false} className="text-xs text-subtle">
          ou continue com
        </Paragraph>
        <View className="h-px flex-1 bg-divider" />
      </Appear>

      <Appear delay={210} className="gap-3">
        <Button
          variant="outline"
          appear={false}
          className="bg-surface"
          iconContainerClassName="bg-surfaceMuted"
          label="Continuar com o Google"
          icon={<GoogleIcon size={20} />}
          disabled={isPending}
          onPress={onGoogle}
        />
        {showApple ? (
          <Button
            appear={false}
            className="bg-foreground"
            label="Continuar com a Apple"
            icon={<AppleIcon size={20} color={colors.foreground} />}
            disabled={isPending}
            onPress={onApple}
          />
        ) : null}
      </Appear>

      <Pressable onPress={onRegister} hitSlop={8} className="flex-row justify-center gap-1.5">
        <Paragraph appear={false} className="text-sm text-muted">
          Não tem conta?
        </Paragraph>
        <Paragraph appear={false} className="text-sm font-semibold text-primary">
          Criar conta
        </Paragraph>
      </Pressable>

      <Pressable onPress={onUndelete} hitSlop={8} className="self-center">
        <Paragraph appear={false} className="text-xs text-subtle">
          Reativar conta excluída
        </Paragraph>
      </Pressable>

      <Paragraph appear={false} className="px-4 text-center text-xs text-subtle">
        Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.
      </Paragraph>
    </Screen>
  )
}
