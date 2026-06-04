import { Pressable, View } from 'react-native'
import { Eye, EyeSlash, Lock, User } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { ControlledTextField } from '@/shared/components/form/controlled-text-field'
import { Appear, Button, Paragraph, Title } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { AppleIcon, GoogleIcon } from './components/brand-icons'
import { BrandMark } from './components/brand-mark'
import { CpfField } from './components/cpf-field'
import { useSignIn } from './hooks/use-sign-in'

/**
 * Login view — UI only. Behavior lives in useSignIn(). Sign in with CPF + senha,
 * Google or Apple (all mocked). Inside <Screen>, so the keyboard never covers the
 * inputs and tapping outside dismisses it.
 */
export default function SignInScreen() {
  const colors = useColors()
  const {
    control,
    showPassword,
    togglePassword,
    onSubmit,
    onGoogle,
    onApple,
    onForgotPassword,
    isCpfPending,
    isGooglePending,
    isApplePending,
    isBusy,
    showApple,
  } = useSignIn()

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
        <CpfField
          control={control}
          name="cpf"
          label="CPF"
          placeholder="000.000.000-00"
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
        <Button label="Entrar" appear={false} isLoading={isCpfPending} disabled={isBusy} onPress={onSubmit} />
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
          isLoading={isGooglePending}
          disabled={isBusy}
          onPress={onGoogle}
        />
        {showApple ? (
          <Button
            appear={false}
            className="bg-foreground"
            label="Continuar com a Apple"
            icon={<AppleIcon size={20} color={colors.foreground} />}
            isLoading={isApplePending}
            disabled={isBusy}
            onPress={onApple}
          />
        ) : null}
      </Appear>

      <Paragraph appear={false} className="px-4 pt-2 text-center text-xs text-subtle">
        Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.
      </Paragraph>
    </Screen>
  )
}
