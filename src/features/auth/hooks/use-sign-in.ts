import { useState } from 'react'
import { Platform } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { signInSchema, type SignInForm } from '../services/auth.dto'
import { useSignInMutation } from './use-sign-in-mutation'
import { useGoogleSignInMutation } from './use-google-sign-in-mutation'

// Apple Sign-In is iOS-only. Kept OFF until the native flow + backend
// (APPLE_CLIENT_IDS) are wired — flip to true to show the button again.
const APPLE_LOGIN_ENABLED = false

/**
 * Sign-in controller. Real login by e-mail/telefone + senha against the Brizze
 * API, plus native Google Sign-In (POST /auth/google). Apple is hidden for now.
 */
export function useSignIn() {
  const toast = useToast()
  const nav = useNavigation()
  const signIn = useSignInMutation()
  const google = useGoogleSignInMutation()
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    // TEMP: admin seedado pra testar a integração. Zerar quando houver cadastro.
    defaultValues: { identifier: '', password: '' },
  })

  const onSubmit = handleSubmit((values) => signIn.mutate(values))
  const soon = () => toast.show({ message: 'Disponível em breve.', type: 'info' })

  return {
    control,
    showPassword,
    togglePassword: () => setShowPassword((value) => !value),
    onSubmit,
    onGoogle: () => google.mutate(),
    onApple: soon,
    onForgotPassword: () => nav.push(nav.routes.public.forgotPassword()),
    onRegister: () => nav.push(nav.routes.public.register()),
    onUndelete: () => nav.push(nav.routes.public.undelete()),
    isPending: signIn.isPending,
    googleLoading: google.isPending,
    showApple: APPLE_LOGIN_ENABLED && Platform.OS === 'ios',
  }
}
