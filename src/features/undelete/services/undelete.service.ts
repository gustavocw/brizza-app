import { apiPost } from '@/lib/api'
import type { AuthResponse } from '@/features/auth/services/auth.dto'
import type { UndeleteForm } from './undelete.dto'

/** Reactivate a soft-deleted account (within 30d). POST /auth/undelete → AuthResponse (auto-login). */
export const UndeleteService = {
  undelete: (body: UndeleteForm) => apiPost<UndeleteForm, AuthResponse>('/auth/undelete', body),
}
