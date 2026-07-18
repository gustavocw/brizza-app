import type { AppNotification } from '../services/notification.dto'
import { useNotificationsQuery } from './use-notifications-query'
import { useUnreadCountQuery } from './use-unread-count-query'
import { useMarkRead } from './use-mark-read'
import { useMarkAllRead } from './use-mark-all-read'

/**
 * Alerts controller. Owns the cursor-paginated history, the unread counter and
 * the notification actions. Tapping a row marks it read; "Marcar todas" clears the
 * unread badge. All writes are optimistic (see the mutation hooks).
 */
export function useAlerts() {
  const query = useNotificationsQuery()
  const unread = useUnreadCountQuery()
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()

  const items = query.data?.pages.flatMap((p) => p.items) ?? []

  const onPressItem = (n: AppNotification) => {
    if (!n.read_at) markRead.mutate(n.id)
  }

  return {
    query,
    items,
    unreadCount: unread.data?.count ?? 0,
    isRefetching: query.isRefetching,
    isFetchingNextPage: query.isFetchingNextPage,
    onRefresh: () => {
      query.refetch()
      unread.refetch()
    },
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage()
    },
    onPressItem,
    onMarkAll: () => markAllRead.mutate(),
  }
}
