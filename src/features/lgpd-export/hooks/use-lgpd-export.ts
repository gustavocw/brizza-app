import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
import { useToast } from '@/providers/toast/use-toast'
import { exportFileName } from '../services/lgpd-export.dto'
import { LgpdExportService } from '../services/lgpd-export.service'

/**
 * Export controller: pulls the full personal data (GET /user/me/export), writes it
 * to a JSON file in the cache and opens the OS share sheet so the user can save it.
 * The endpoint is rate limited (5/h) → a 429 gets its own message.
 */
export function useLgpdExport() {
  const toast = useToast()

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await LgpdExportService.fetch()
      if (!res.success) throw res.error

      const uri = FileSystem.cacheDirectory + exportFileName()
      await FileSystem.writeAsStringAsync(uri, JSON.stringify(res.data, null, 2))

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/json',
          UTI: 'public.json',
          dialogTitle: 'Exportar meus dados',
        })
      }
    },
    onSuccess: () => toast.show({ message: 'Dados exportados.', type: 'success' }),
    onError: (err) => {
      const status = (err as AxiosError)?.response?.status
      toast.show({
        message:
          status === 429
            ? 'Você já exportou há pouco. Tente novamente em uma hora.'
            : 'Não foi possível exportar seus dados.',
        type: 'error',
      })
    },
  })

  return { onExport: () => mutation.mutate(), isExporting: mutation.isPending }
}
