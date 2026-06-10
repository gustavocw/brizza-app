import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { VERIFY, codeSchema, type CodeForm, type VerifyKind } from '../services/verify.dto'
import { VerifyService } from '../services/verify.service'

/**
 * Verify controller. Resolves the `kind` param, auto-sends a code on open, then
 * confirms it (invalidating the me query so the verified flag updates).
 */
export function useVerify() {
  const nav = useNavigation()
  const toast = useToast()
  const qc = useQueryClient()
  const { kind: raw } = useLocalSearchParams<{ kind: string }>()
  const kind: VerifyKind = raw === 'phone' ? 'phone' : 'email'

  const { control, handleSubmit } = useForm<CodeForm>({ resolver: zodResolver(codeSchema), defaultValues: { code: '' } })

  const request = useMutation({
    mutationFn: async () => {
      const res = await VerifyService.request(kind)
      if (!res.success) throw res.error
    },
  })

  // Send the first code when the screen opens.
  useEffect(() => {
    request.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirm = useMutation({
    mutationFn: async (form: CodeForm) => {
      const res = await VerifyService.confirm(kind, form.code)
      if (!res.success) throw res.error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.me.profile() })
      toast.show({ message: VERIFY[kind].done, type: 'success' })
      nav.back()
    },
  })

  return {
    config: VERIFY[kind],
    control,
    onConfirm: handleSubmit((v) => confirm.mutate(v)),
    confirming: confirm.isPending,
    onResend: () => {
      request.mutate()
      toast.show({ message: 'Código reenviado.', type: 'info' })
    },
    resending: request.isPending,
  }
}
