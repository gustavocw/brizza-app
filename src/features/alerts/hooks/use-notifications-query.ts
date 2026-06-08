import { useInfiniteQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { NotificationService } from '../services/notification.service'

// READ → useInfiniteQuery. The API paginates by CURSOR (`before` = the previous
// page's `next_cursor`), not by page number, so this can't use useInfiniteList.
// Unwrap inside queryFn (throw on failure) so loading/error state works.
export function useNotificationsQuery() {
  return useInfiniteQuery({
    queryKey: qk.notifications.list(),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const res = await NotificationService.list({ before: pageParam, limit: 20 })
      if (!res.success) throw res.error
      return res.data
    },
    getNextPageParam: (last) => (last.has_more ? (last.next_cursor ?? undefined) : undefined),
  })
}
