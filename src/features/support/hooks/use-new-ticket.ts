import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { newTicketSchema, type NewTicketForm } from '../services/support.dto'
import { SupportService } from '../services/support.service'

/** New-ticket controller: validated form → POST, invalidates the list, goes back. */
export function useNewTicket() {
  const nav = useNavigation()
  const toast = useToast()
  const qc = useQueryClient()

  const { control, handleSubmit } = useForm<NewTicketForm>({
    resolver: zodResolver(newTicketSchema),
    defaultValues: { category: 'other', subject: '', body: '' },
  })

  const mutation = useMutation({
    mutationFn: async (form: NewTicketForm) => {
      const res = await SupportService.create(form)
      if (!res.success) throw res.error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.support.list() })
      toast.show({ message: 'Chamado aberto.', type: 'success' })
      nav.back()
    },
  })

  return { control, onSubmit: handleSubmit((v) => mutation.mutate(v)), isPending: mutation.isPending }
}
