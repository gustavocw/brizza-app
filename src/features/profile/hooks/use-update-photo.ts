import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { PhotoService } from '../services/photo.service'

const MAX_BYTES = 5 * 1024 * 1024 // server limit for the avatar (Bunny.net)

/**
 * Upload a new profile photo: get a presigned URL, PUT the file bytes to Bunny,
 * then confirm. Invalidates the me query so the new avatar shows. Plain Errors
 * thrown here carry a user-facing message; Axios errors fall back to a generic one.
 */
export function useUpdatePhoto() {
  const qc = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: async (uri: string) => {
      const url = await PhotoService.uploadUrl()
      if (!url.success) throw url.error

      const file = await fetch(uri)
      const blob = await file.blob()
      if (blob.size > MAX_BYTES) throw new Error('A imagem precisa ter no máximo 5 MB.')

      const put = await fetch(url.data.upload_url, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': blob.type || 'image/jpeg' },
      })
      if (!put.ok) throw new Error('Não foi possível enviar a imagem.')

      const confirmed = await PhotoService.confirm()
      if (!confirmed.success) throw confirmed.error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.me.profile() })
      toast.show({ message: 'Foto atualizada.', type: 'success' })
    },
    onError: (err) => {
      const message =
        err instanceof Error && !(err as AxiosError).isAxiosError
          ? err.message
          : 'Não foi possível atualizar a foto.'
      toast.show({ message, type: 'error' })
    },
  })
}
