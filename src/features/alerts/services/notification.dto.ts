// Contract for notifications. Mirrors the Brizza API `Notification` schema and the
// cursor-paginated `GET /user/me/notifications` response (apidocs/openapi.yaml).

export type NotificationKind =
  | 'battery_low'
  | 'battery_full'
  | 'charging_started'
  | 'charging_complete'
  | 'movement_alert'
  | 'marketing'
  | 'system'

export type AppNotification = {
  id: string
  kind: NotificationKind
  title: string
  body: string
  data?: Record<string, unknown>
  created_at: string
  read_at?: string | null
}

/** One page of the cursor-paginated history. `next_cursor` feeds the `before` query param. */
export type NotificationsPage = {
  items: AppNotification[]
  has_more: boolean
  next_cursor: string | null
}

export type UnreadCount = { count: number }

/** Relative, short pt-BR time label ("agora", "5 min", "2 h", "3 d", "12 abr"). */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const seconds = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (seconds < 60) return 'agora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} d`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

/** Header subtitle from the unread count. */
export function unreadLabel(count: number): string {
  if (count <= 0) return 'Tudo em dia'
  return count === 1 ? '1 não lida' : `${count} não lidas`
}
