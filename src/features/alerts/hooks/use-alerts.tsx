import { useBottomSheet } from '@/providers/overlay/use-bottom-sheet'
import { NotificationActionsSheet } from '../components/notification-actions-sheet'
import type { AppNotification } from '../services/notification.dto'
import { useNotificationsQuery } from './use-notifications-query'
import { useUnreadCountQuery } from './use-unread-count-query'
import { useMarkRead } from './use-mark-read'
import { useMarkAllRead } from './use-mark-all-read'
import { useDeleteNotification } from './use-delete-notification'

/**
 * Alerts controller. Owns the cursor-paginated history, the unread counter and
 * every notification action. Tapping a row marks it read; the kebab opens a sheet
 * with read/delete. All writes are optimistic (see the mutation hooks).
 */
export function useAlerts() {
  const sheet = useBottomSheet()
  const query = useNotificationsQuery()
  const unread = useUnreadCountQuery()
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()
  const remove = useDeleteNotification()

  const items = query.data?.pages.flatMap((p) => p.items) ?? []

  const onPressItem = (n: AppNotification) => {
    if (!n.read_at) markRead.mutate(n.id)
  }

  const onOptions = (n: AppNotification) =>
    sheet.open({
      snapToContent: true,
      children: ({ close }) => (
        <NotificationActionsSheet
          notification={n}
          onMarkRead={() => markRead.mutate(n.id)}
          onDelete={() => remove.mutate(n)}
          onClose={close}
        />
      ),
    })

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
    onOptions,
    onMarkAll: () => markAllRead.mutate(),
  }
}
