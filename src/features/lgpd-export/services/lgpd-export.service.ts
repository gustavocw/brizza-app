import { apiGet } from '@/lib/api'
import type { LgpdExport } from './lgpd-export.dto'

/**
 * LGPD data export.
 *   GET /user/me/export → full personal data as inline JSON (rate limited 5/h).
 */
export const LgpdExportService = {
  fetch: () => apiGet<void, LgpdExport>('/user/me/export'),
}
