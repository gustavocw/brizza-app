import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { onlyDigits } from '@/shared/utils/masks'
import {
  CONTACT,
  confirmSchema,
  requestEmailSchema,
  requestPhoneSchema,
  type ConfirmForm,
  type ContactKind,
  type RequestForm,
} from '../services/change-contact.dto'
import { ChangeContactService } from '../services/change-contact.service'

/**
 * Change-contact controller. Resolves the `kind` route param (email/phone) and
 * runs the two-phase flow (request new value → confirm with code), invalidating
 * the me query when done.
 */
export function useChangeContact() {
  const nav = useNavigation()
  const toast = useToast()
  const qc = useQueryClient()
  const { kind: raw } = useLocalSearchParams<{ kind: string }>()
  const kind: ContactKind = raw === 'phone' ? 'phone' : 'email'

  const [phase, setPhase] = useState<'request' | 'confirm'>('request')
  const [value, setValue] = useState('')

  const requestForm = useForm<RequestForm>({
    resolver: zodResolver(kind === 'email' ? requestEmailSchema : requestPhoneSchema),
    defaultValues: { value: '', current_password: '' },
    mode: 'onChange',
  })
  const confirmForm = useForm<ConfirmForm>({
    resolver: zodResolver(confirmSchema),
    defaultValues: { code: '' },
    mode: 'onChange',
  })

  const requestMutation = useMutation({
    mutationFn: async (form: RequestForm) => {
      const v = kind === 'phone' ? onlyDigits(form.value) : form.value.trim().toLowerCase()
      const res = await ChangeContactService.request(kind, v, form.current_password)
      if (!res.success) throw res.error
      return v
    },
    onSuccess: (v) => {
      setValue(v)
      setPhase('confirm')
      toast.show({ message: 'Enviamos um código de confirmação.', type: 'info' })
    },
  })

  const confirmMutation = useMutation({
    mutationFn: async (form: ConfirmForm) => {
      const res = await ChangeContactService.confirm(kind, form.code)
      if (!res.success) throw res.error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.me.profile() })
      toast.show({ message: CONTACT[kind].done, type: 'success' })
      nav.back()
    },
  })

  return {
    config: CONTACT[kind],
    phase,
    value,
    requestControl: requestForm.control,
    onRequest: requestForm.handleSubmit((v) => requestMutation.mutate(v)),
    requesting: requestMutation.isPending,
    canRequest: requestForm.formState.isValid,
    confirmControl: confirmForm.control,
    onConfirm: confirmForm.handleSubmit((v) => confirmMutation.mutate(v)),
    confirming: confirmMutation.isPending,
    // Unlocks only with the full 6-digit code.
    canConfirm: confirmForm.formState.isValid,
    onBack: () => (phase === 'confirm' ? setPhase('request') : nav.back()),
  }
}
