import { apiDelete, apiGet } from '@/lib/api'
import type { DeleteAccountForm, Profile } from './profile.dto'

/**
 * Profile service. Returns ApiResponse<R> (never throws); the hooks unwrap.
 * Contract (apidocs/openapi.yaml):
 *   GET    /user/me  → Profile
 *   DELETE /user/me  ({ password }) → 204  (LGPD Art. 18 VI soft-delete)
 */
export const ProfileService = {
  me: () => apiGet<void, Profile>('/user/me'),
  deleteAccount: (password: string) => apiDelete<DeleteAccountForm, void>('/user/me', { password }),
}
