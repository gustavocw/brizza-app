import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getApiErrorCode, getApiErrorMessage } from '@/lib/api'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { BikeService } from '../services/bike.service'

// Mesma validação do backend: formato antigo (ABC1234, traço opcional) ou
// Mercosul (ABC1D23).
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

const MESSAGES: Record<string, string> = {
  BIKE_IMEI_UNKNOWN: 'Essa moto não está cadastrada. Fale com a Minas Brisa.',
  BIKE_IMEI_INACTIVE: 'Essa moto está inativa no cadastro.',
  BIKE_IMEI_TAKEN: 'Esse rastreador já está vinculado a outra conta.',
  BIKE_QR_TAKEN: 'Esse QR code já está vinculado a outra conta.',
  BIKE_PLATE_TAKEN: 'Essa placa já está vinculada a outra conta.',
  BIKE_ALREADY_LINKED: 'Você já tem uma moto vinculada.',
  BIKE_IDENTIFIER_REQUIRED: 'Escaneie o QR code ou informe a placa.',
}

/**
 * Vincular moto. O caminho principal é o QR colado na moto, que carrega o IMEI
 * do rastreador; a placa fica como alternativa quando a etiqueta está ilegível.
 */
export function useLinkBike() {
  const nav = useNavigation()
  const toast = useToast()
  const qc = useQueryClient()
  const [scannerOpen, setScannerOpen] = useState(false)

  const { control, handleSubmit } = useForm<LinkBikeForm>({
    resolver: zodResolver(schema),
    defaultValues: { plate: '', model: '' },
  })

  const mutation = useMutation({
    mutationFn: async (body: { plate?: string; qr_code?: string; model?: string }) => {
      const res = await BikeService.link(body)
      if (!res.success) throw res.error
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.bike.all })
      qc.invalidateQueries({ queryKey: qk.dashboard.all })
      toast.show({ message: 'Moto vinculada!', type: 'success' })
      nav.back()
    },
    onError: (err) => {
      const code = getApiErrorCode(err)
      toast.show({ message: (code && MESSAGES[code]) || getApiErrorMessage(err), type: 'error' })
    },
  })

  const onScanned = (value: string) => {
    setScannerOpen(false)
    mutation.mutate({ qr_code: value.trim() })
  }

  const onSubmit = handleSubmit((form) =>
    mutation.mutate({
      // Placa brasileira não tem separador; tira o que o usuário digitou.
      plate: form.plate.replace(/[^A-Za-z0-9]/g, '').toUpperCase(),
      model: form.model?.trim() || undefined,
    }),
  )

  return {
    control,
    onSubmit,
    isPending: mutation.isPending,
    scannerOpen,
    openScanner: () => setScannerOpen(true),
    closeScanner: () => setScannerOpen(false),
    onScanned,
  }
}
