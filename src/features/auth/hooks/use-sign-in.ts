import { useState } from 'react'
import { Platform } from 'react-native'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/providers/toast/use-toast'
import { signInSchema, type SignInForm } from '../services/auth.dto'
import { onlyDigits } from '../utils/cpf'
import { useSignInMutation } from './use-sign-in-mutation'

/**
 * Sign-in controller. Owns the form, the password visibility toggle and the
 * three entry points (CPF+senha, Google, Apple). The view renders what it
 * returns — no logic in the JSX.
 */
export function useSignIn() {
  const toast = useToast()
  const signIn = useSignInMutation()
  const [showPassword, setShowPassword] = useState(false)

  const { control, handleSubmit } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    // TEMP (mock): prefilled valid test credentials so login is one tap.
    // Reset both back to '' when the real /auth is wired.
    defaultValues: { cpf: '529.982.247-25', password: '123456' },
  })

  // Per-button spinner: only the method currently in flight shows loading.
  const pendingMethod = signIn.isPending ? signIn.variables?.method : undefined

  const onSubmit = handleSubmit(({ cpf, password }) => {
    signIn.mutate({ method: 'cpf', cpf: onlyDigits(cpf), password })
  })

  return {
    control,
    showPassword,
    togglePassword: () => setShowPassword((value) => !value),
    onSubmit,
    onGoogle: () => signIn.mutate({ method: 'google' }),
    onApple: () => signIn.mutate({ method: 'apple' }),
    onForgotPassword: () => toast.show({ message: 'Recuperação de senha em breve.', type: 'info' }),
    isCpfPending: pendingMethod === 'cpf',
    isGooglePending: pendingMethod === 'google',
    isApplePending: pendingMethod === 'apple',
    isBusy: signIn.isPending,
    showApple: Platform.OS === 'ios',
  }
}
