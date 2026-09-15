import { apiDelete, apiGet, apiPut } from '@/lib/api'
import type { NotificationKind, NotificationsPage, UnreadCount } from './notification.dto'

type ListParams = { before?: string; limit?: number; kind?: NotificationKind }

/**
 * Alertas da conta. Mesmo feed que gera o push (bateria, carga, movimento,
 * avisos do sistema). Devolve ApiResponse; quem desembrulha são os hooks.
 */
export const NotificationService = {
  list: (params: ListParams) => apiGet<ListParams, NotificationsPage>('/user/me/notifications', params),
  unreadCount: () => apiGet<void, UnreadCount>('/user/me/notifications/unread-count'),
  markRead: (id: string) => apiPut<void, void>(`/user/me/notifications/${id}/read`),
  markAllRead: () => apiPut<void, { updated_count: number }>('/user/me/notifications/read-all'),
  remove: (id: string) => apiDelete<void, void>(`/user/me/notifications/${id}`),
}
