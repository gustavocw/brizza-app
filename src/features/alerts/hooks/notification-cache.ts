import type { InfiniteData, QueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import type { AppNotification, NotificationsPage, UnreadCount } from '../services/notification.dto'

type ListData = InfiniteData<NotificationsPage>

/** Snapshot of both notification caches, for optimistic rollback. */
export type NotificationSnapshot = { list?: ListData; unread?: UnreadCount }

export function snapshot(qc: QueryClient): NotificationSnapshot {
  return {
    list: qc.getQueryData<ListData>(qk.notifications.list()),
    unread: qc.getQueryData<UnreadCount>(qk.notifications.unread()),
  }
}

export function restore(qc: QueryClient, snap: NotificationSnapshot) {
  if (snap.list) qc.setQueryData(qk.notifications.list(), snap.list)
  if (snap.unread) qc.setQueryData(qk.notifications.unread(), snap.unread)
}

/** Map every notification across all loaded pages. */
export function patchItems(qc: QueryClient, fn: (items: AppNotification[]) => AppNotification[]) {
  qc.setQueryData<ListData>(qk.notifications.list(), (old) =>
    old ? { ...old, pages: old.pages.map((p) => ({ ...p, items: fn(p.items) })) } : old,
  )
}

/** Adjust the unread counter, clamped at zero. */
export function setUnread(qc: QueryClient, next: (count: number) => number) {
  qc.setQueryData<UnreadCount>(qk.notifications.unread(), (old) =>
    old ? { count: Math.max(0, next(old.count)) } : old,
  )
}
