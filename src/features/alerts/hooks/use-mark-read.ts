import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { NotificationService } from '../services/notification.service'
import { patchItems, restore, setUnread, snapshot } from './notification-cache'

/**
 * Mark one notification as read. Optimistic: stamps read_at and drops the unread
 * count immediately, rolling back if the request fails. Call only for unread
 * items so the counter never double-decrements.
 */
export function useMarkRead() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await NotificationService.markRead(id)
      if (!res.success) throw res.error
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.notifications.all })
      const snap = snapshot(qc)
      // Decrement the counter only when this id is actually unread RIGHT NOW, so a
      // no-op list patch (already read, e.g. a double tap) never drops the count.
      const wasUnread = snap.list?.pages.some((p) => p.items.some((n) => n.id === id && !n.read_at)) ?? false
      const now = new Date().toISOString()
      patchItems(qc, (items) => items.map((n) => (n.id === id && !n.read_at ? { ...n, read_at: now } : n)))
      if (wasUnread) setUnread(qc, (count) => count - 1)
      return { snap }
    },
    onError: (_err, _id, ctx) => ctx && restore(qc, ctx.snap),
    // Reconcile the authoritative count after the write (self-heals any drift).
    onSettled: () => qc.invalidateQueries({ queryKey: qk.notifications.unread() }),
  })
}
