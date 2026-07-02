import { apiPost } from '@/lib/api'
import type { UndeleteForm } from './undelete.dto'

/** Reactivate a soft-deleted account (within 30d). POST /auth/undelete → 204 (no body). */
export const UndeleteService = {
  undelete: (body: UndeleteForm) => apiPost<UndeleteForm, void>('/auth/undelete', body),
}
