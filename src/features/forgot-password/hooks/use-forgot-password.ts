import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import {
  requestSchema,
  resetSchema,
  type RequestForm,
  type ResetForm,
} from '../services/forgot-password.dto'
import { ForgotPasswordService } from '../services/forgot-password.service'

/**
 * Forgot-password controller. Two phases on one screen: request a code, then reset.
 * forgot-password always returns 204 (anti-enumeration), so we always advance to
 * the reset phase. reset-password lands back on login.
 */
export function useForgotPassword() {
  const nav = useNavigation()
  const toast = useToast()
  const [phase, setPhase] = useState<'request' | 'reset'>('request')
  const [identifier, setIdentifier] = useState('')

  const requestForm = useForm<RequestForm>({ resolver: zodResolver(requestSchema), defaultValues: { identifier: '' } })
  const resetForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: '', new_password: '', confirm: '' },
  })

  const requestMutation = useMutation({
    mutationFn: async (form: RequestForm) => {
      const id = form.identifier.trim()
      const res = await ForgotPasswordService.requestCode(id)
      if (!res.success) throw res.error
      return id
    },
    onSuccess: (id) => {
      setIdentifier(id)
      setPhase('reset')
      toast.show({ message: 'Se a conta existir, enviamos um código.', type: 'info' })
    },
  })

  const resetMutation = useMutation({
    mutationFn: async (form: ResetForm) => {
      const res = await ForgotPasswordService.reset({
        identifier,
        code: form.code,
        new_password: form.new_password,
        new_password_confirm: form.confirm,
      })
      if (!res.success) throw res.error
    },
    onSuccess: () => {
      toast.show({ message: 'Senha redefinida. Entre com a nova senha.', type: 'success' })
      nav.replace(nav.routes.public.signIn())
    },
  })

  return {
    phase,
    identifier,
    requestControl: requestForm.control,
    onRequest: requestForm.handleSubmit((v) => requestMutation.mutate(v)),
    requesting: requestMutation.isPending,
    resetControl: resetForm.control,
    onReset: resetForm.handleSubmit((v) => resetMutation.mutate(v)),
    resetting: resetMutation.isPending,
    onBack: () => (phase === 'reset' ? setPhase('request') : nav.back()),
  }
}
