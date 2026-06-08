import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { NotificationService } from '../services/notification.service'

// Authoritative unread total (across all notifications, not just loaded pages).
export function useUnreadCountQuery() {
  return useQuery({
    queryKey: qk.notifications.unread(),
    queryFn: async () => {
      const res = await NotificationService.unreadCount()
      if (!res.success) throw res.error
      return res.data
    },
  })
}
