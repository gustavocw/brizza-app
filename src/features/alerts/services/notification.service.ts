import type { ApiResponse } from '@/lib/api'
import type { AppNotification, NotificationKind, NotificationsPage, UnreadCount } from './notification.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED notifications. Alerts are driven by the third-party fleet telemetry
// (bateria, movimento, carga), which isn't wired to our backend yet — so this
// serves a canned feed. To go live, swap the calls for /user/me/notifications;
// the hooks, controller and view stay untouched.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const minsAgo = (n: number) => new Date(Date.now() - n * 60_000).toISOString()

const NOTIFICATIONS: AppNotification[] = [
  { id: '1', kind: 'battery_low', title: 'Bateria baixa', body: 'Sua Brizze está com 18%. Bora carregar antes de sair?', created_at: minsAgo(8), read_at: null },
  { id: '2', kind: 'charging_complete', title: 'Carga concluída', body: 'Sua moto chegou a 100%. Já pode desconectar.', created_at: minsAgo(180), read_at: null },
  { id: '3', kind: 'movement_alert', title: 'Movimento detectado', body: 'Detectamos movimento na sua moto. Confira se está tudo bem.', created_at: minsAgo(600), read_at: minsAgo(590) },
  { id: '4', kind: 'charging_started', title: 'Carregando', body: 'Sua moto começou a carregar no Brizze Hub Savassi.', created_at: minsAgo(1440), read_at: minsAgo(1430) },
  { id: '5', kind: 'system', title: 'Bem-vindo à Brizze', body: 'Vincule sua moto e acompanhe bateria, autonomia e alertas por aqui.', created_at: minsAgo(4320), read_at: minsAgo(4300) },
]

type ListParams = { before?: string; limit?: number; kind?: NotificationKind }

export const NotificationService = {
  list: async (_params: ListParams): Promise<ApiResponse<NotificationsPage>> => {
    await delay(500)
    return { success: true, data: { items: NOTIFICATIONS, has_more: false, next_cursor: null } }
  },
  unreadCount: async (): Promise<ApiResponse<UnreadCount>> => {
    await delay(300)
    return { success: true, data: { count: NOTIFICATIONS.filter((n) => !n.read_at).length } }
  },
  markRead: async (_id: string): Promise<ApiResponse<void>> => {
    await delay(200)
    return { success: true, data: undefined }
  },
  markAllRead: async (): Promise<ApiResponse<{ updated_count: number }>> => {
    await delay(200)
    return { success: true, data: { updated_count: NOTIFICATIONS.filter((n) => !n.read_at).length } }
  },
  remove: async (_id: string): Promise<ApiResponse<void>> => {
    await delay(200)
    return { success: true, data: undefined }
  },
}
