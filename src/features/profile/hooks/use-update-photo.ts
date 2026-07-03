import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import * as FileSystem from 'expo-file-system/legacy'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { PhotoService } from '../services/photo.service'

const MAX_BYTES = 5 * 1024 * 1024 // server limit for the avatar (Bunny.net)

const contentTypeOf = (uri: string): string => {
  const ext = uri.split('?')[0].split('.').pop()?.toLowerCase()
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  return 'image/jpeg'
}

/**
 * Upload a new profile photo: get a presigned URL, PUT the file bytes to Bunny,
 * then confirm. The bytes are streamed with expo-file-system (React Native can't
 * build a Blob from an ArrayBuffer, so fetch(uri).blob() throws on New Arch).
 * Invalidates the me query so the new avatar shows.
 */
export function useUpdatePhoto() {
  const qc = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: async (uri: string) => {
      const info = await FileSystem.getInfoAsync(uri)
      if (info.exists && info.size && info.size > MAX_BYTES) {
        throw new Error('A imagem precisa ter no máximo 5 MB.')
      }

      const url = await PhotoService.uploadUrl()
      if (!url.success) throw url.error

      const put = await FileSystem.uploadAsync(url.data.upload_url, uri, {
        httpMethod: 'PUT',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: { 'Content-Type': contentTypeOf(uri) },
      })
      if (put.status < 200 || put.status >= 300) throw new Error('Não foi possível enviar a imagem.')

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
