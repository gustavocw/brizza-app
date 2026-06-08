import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { NotificationService } from '../services/notification.service'
import { patchItems, restore, setUnread, snapshot } from './notification-cache'

/**
 * Mark every notification as read. Optimistic: stamps read_at on all loaded items
 * and zeroes the unread count, rolling back on failure. Reconciles the authoritative
 * count on settle (only the count: refetching the whole list here would resurrect a
 * row that a concurrent delete optimistically removed but hasn't yet confirmed).
 */
export function useMarkAllRead() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const res = await NotificationService.markAllRead()
      if (!res.success) throw res.error
    },
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: qk.notifications.all })
      const snap = snapshot(qc)
      const now = new Date().toISOString()
      patchItems(qc, (items) => items.map((n) => (n.read_at ? n : { ...n, read_at: now })))
      setUnread(qc, () => 0)
      return { snap }
    },
    onError: (_err, _vars, ctx) => ctx && restore(qc, ctx.snap),
    onSettled: () => qc.invalidateQueries({ queryKey: qk.notifications.unread() }),
  })
}
