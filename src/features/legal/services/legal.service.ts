import { apiGet, apiPost } from '@/lib/api'
import type { LegalDocument, LegalKind, TermsStatus } from './legal.dto'

/**
 * Legal service. Public endpoints serve the current terms / privacy markdown
 * (`GET /legal/{kind}/current`); accept records the user's acceptance of both
 * current versions (`POST /user/me/accept-terms`); status returns the signed-in
 * user's latest acceptance (`GET /user/me/terms-status`).
 */
export const LegalService = {
  current: (kind: LegalKind) => apiGet<void, LegalDocument>(`/legal/${kind}/current`),
  accept: (body: { terms_version: string; privacy_version: string }) =>
    apiPost<typeof body, void>('/user/me/accept-terms', body),
  status: () => apiGet<void, TermsStatus>('/user/me/terms-status'),
}
