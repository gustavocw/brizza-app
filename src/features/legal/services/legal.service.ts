import { apiGet } from '@/lib/api'
import type { LegalDocument, LegalKind } from './legal.dto'

/**
 * Legal service. Public endpoints (no auth) serving the current terms / privacy
 * policy as markdown. `GET /legal/{kind}/current`.
 */
export const LegalService = {
  current: (kind: LegalKind) => apiGet<void, LegalDocument>(`/legal/${kind}/current`),
}
