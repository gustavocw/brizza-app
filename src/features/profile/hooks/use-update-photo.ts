import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { PhotoService } from '../services/photo.service'

/**
 * Upload a new profile photo: get a presigned URL, PUT the file bytes to Bunny,
 * then confirm. Invalidates the me query so the new avatar shows.
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
      const put = await fetch(url.data.upload_url, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': blob.type || 'image/jpeg' },
      })
      if (!put.ok) throw new Error(`Falha no upload (${put.status})`)

      const confirmed = await PhotoService.confirm(url.data.photo_id)
      if (!confirmed.success) throw confirmed.error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.me.profile() })
      toast.show({ message: 'Foto atualizada.', type: 'success' })
    },
    onError: () => toast.show({ message: 'Não foi possível atualizar a foto.', type: 'error' }),
  })
}
