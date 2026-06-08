import { useState } from 'react'
import { Platform } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/providers/toast/use-toast'
import { signInSchema, type SignInForm } from '../services/auth.dto'
import { useSignInMutation } from './use-sign-in-mutation'

/**
 * Sign-in controller. Real login by e-mail/telefone + senha against the Brizza
 * API. Google and Apple are not wired yet (Apple has no backend endpoint, Google
 * needs the native Google Sign-In), so they show a "soon" toast.
 */
export function useSignIn() {
  const toast = useToast()
  const signIn = useSignInMutation()
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    // TEMP: admin seedado pra testar a integração. Zerar quando houver cadastro.
    defaultValues: { identifier: 'admin@brizza.com.br', password: 'Decode3430!' },
  })

  const onSubmit = handleSubmit((values) => signIn.mutate(values))
  const soon = () => toast.show({ message: 'Disponível em breve.', type: 'info' })

  return {
    control,
    showPassword,
    togglePassword: () => setShowPassword((value) => !value),
    onSubmit,
    onGoogle: soon,
    onApple: soon,
    onForgotPassword: () => toast.show({ message: 'Recuperação de senha em breve.', type: 'info' }),
    isPending: signIn.isPending,
    showApple: Platform.OS === 'ios',
  }
}
