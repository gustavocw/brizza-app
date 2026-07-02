import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { BikeService } from '../services/bike.service'

// Mirrors the backend's plate_br validator: old format (ABC1234, optional dash)
// or Mercosul (ABC1D23). Checked on the cleaned uppercase value.
const PLATE_RE = /^[A-Z]{3}-?\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/

const schema = z.object({
  plate: z
    .string()
    .trim()
    .min(1, 'Informe a placa')
    .refine((v) => PLATE_RE.test(v.replace(/[^A-Za-z0-9-]/g, '').toUpperCase()), 'Placa inválida'),
  model: z.string().trim().optional(),
})
type LinkBikeForm = z.infer<typeof schema>

/** Link-bike controller. POST /user/me/bike, invalidates the bike query, goes back. */
export function useLinkBike() {
  const nav = useNavigation()
  const toast = useToast()
  const qc = useQueryClient()

  const { control, handleSubmit } = useForm<LinkBikeForm>({
    resolver: zodResolver(schema),
    defaultValues: { plate: '', model: '' },
  })

  const mutation = useMutation({
    mutationFn: async (form: LinkBikeForm) => {
      const res = await BikeService.link({
        // BR plates have no separators; strip anything the user typed (dash, space).
        plate: form.plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase(),
        model: form.model?.trim() || undefined,
      })
      if (!res.success) throw res.error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.bike.all })
      toast.show({ message: 'Moto vinculada!', type: 'success' })
      nav.back()
    },
  })

  return { control, onSubmit: handleSubmit((v) => mutation.mutate(v)), isPending: mutation.isPending }
}
