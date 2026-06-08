import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { NotificationPrefsService } from '../services/notification-prefs.service'
import type { NotificationPreferences } from '../services/notification-prefs.dto'

// READ → useQuery.
export function useNotificationPrefsQuery() {
  return useQuery({
    queryKey: qk.notificationPrefs.all,
    queryFn: async () => {
      const res = await NotificationPrefsService.get()
      if (!res.success) throw res.error
      return res.data
    },
  })
}

/**
 * Update prefs (full PUT). Optimistic so the toggle flips instantly; rolls back on
 * failure and reconciles with the server's echo on success.
 */
export function useUpdateNotificationPrefs() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (prefs: NotificationPreferences) => {
      const res = await NotificationPrefsService.update(prefs)
      if (!res.success) throw res.error
      return res.data
    },
    onMutate: async (prefs) => {
      await qc.cancelQueries({ queryKey: qk.notificationPrefs.all })
      const prev = qc.getQueryData<NotificationPreferences>(qk.notificationPrefs.all)
      qc.setQueryData(qk.notificationPrefs.all, prefs)
      return { prev }
    },
    onError: (_err, _prefs, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.notificationPrefs.all, ctx.prev)
    },
    onSuccess: (data) => qc.setQueryData(qk.notificationPrefs.all, data),
  })
}
