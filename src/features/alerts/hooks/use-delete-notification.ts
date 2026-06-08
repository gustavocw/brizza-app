import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import type { AppNotification } from '../services/notification.dto'
import { NotificationService } from '../services/notification.service'
import { patchItems, restore, setUnread, snapshot } from './notification-cache'

/**
 * Delete a notification (hard delete). Optimistic: removes it from the list and,
 * if it was unread, drops the unread count, rolling back on failure. Takes the
 * whole notification so the unread adjustment needs no extra cache lookup.
 */
export function useDeleteNotification() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (notification: AppNotification) => {
      const res = await NotificationService.remove(notification.id)
      if (!res.success) throw res.error
    },
    onMutate: async (notification) => {
      await qc.cancelQueries({ queryKey: qk.notifications.all })
      const snap = snapshot(qc)
      patchItems(qc, (items) => items.filter((n) => n.id !== notification.id))
      if (!notification.read_at) setUnread(qc, (count) => count - 1)
      return { snap }
    },
    onError: (_err, _notification, ctx) => ctx && restore(qc, ctx.snap),
    onSettled: () => qc.invalidateQueries({ queryKey: qk.notifications.unread() }),
  })
}
