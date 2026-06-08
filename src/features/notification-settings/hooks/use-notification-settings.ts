import { useNavigation } from '@/shared/hooks/use-navigation'
import type { PrefKey } from '../services/notification-prefs.dto'
import { useNotificationPrefsQuery, useUpdateNotificationPrefs } from './use-notification-prefs'

/**
 * Notification settings controller. Owns the prefs query and the toggle action.
 * Toggling sends the FULL prefs object (the API is a full PUT), applied optimistically.
 */
export function useNotificationSettings() {
  const nav = useNavigation()
  const query = useNotificationPrefsQuery()
  const update = useUpdateNotificationPrefs()
  const prefs = query.data

  const onToggle = (key: PrefKey) => {
    if (!prefs) return
    update.mutate({ ...prefs, [key]: !prefs[key] })
  }

  return { query, prefs, onToggle, onBack: nav.back }
}
