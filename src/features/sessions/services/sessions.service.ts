import { apiDelete, apiGet } from '@/lib/api'
import type { Session } from './sessions.dto'

/** Active sessions. GET /auth/sessions → { sessions }; DELETE /auth/sessions/{id} → 204. */
export const SessionsService = {
  list: () => apiGet<void, { sessions: Session[] }>('/auth/sessions'),
  revoke: (id: string) => apiDelete<void, void>(`/auth/sessions/${id}`),
}
