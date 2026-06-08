import { apiDelete, apiGet, apiPut } from '@/lib/api'
import type { NotificationKind, NotificationsPage, UnreadCount } from './notification.dto'

type ListParams = { before?: string; limit?: number; kind?: NotificationKind }

/**
 * Notification service. Returns ApiResponse<R> (never throws); the hooks unwrap.
 * Contract (apidocs/openapi.yaml):
 *   GET    /user/me/notifications?before&limit&kind → cursor page
 *   GET    /user/me/notifications/unread-count       → { count }
 *   PUT    /user/me/notifications/read-all           → { updated_count }
 *   PUT    /user/me/notifications/{id}/read          → 204
 *   DELETE /user/me/notifications/{id}               → 204
 */
export const NotificationService = {
  list: (params: ListParams) => apiGet<ListParams, NotificationsPage>('/user/me/notifications', params),
  unreadCount: () => apiGet<void, UnreadCount>('/user/me/notifications/unread-count'),
  markRead: (id: string) => apiPut<void, void>(`/user/me/notifications/${id}/read`),
  markAllRead: () => apiPut<void, { updated_count: number }>('/user/me/notifications/read-all'),
  remove: (id: string) => apiDelete<void, void>(`/user/me/notifications/${id}`),
}
