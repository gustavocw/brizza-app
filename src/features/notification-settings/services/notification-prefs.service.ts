import { apiGet, apiPut } from '@/lib/api'
import type { NotificationPreferences } from './notification-prefs.dto'

/**
 * Notification preferences. Returns ApiResponse (never throws); hooks unwrap.
 *   GET /user/me/notification-preferences → prefs
 *   PUT /user/me/notification-preferences (full object) → prefs
 */
export const NotificationPrefsService = {
  get: () => apiGet<void, NotificationPreferences>('/user/me/notification-preferences'),
  update: (prefs: NotificationPreferences) =>
    apiPut<NotificationPreferences, NotificationPreferences>('/user/me/notification-preferences', prefs),
}
