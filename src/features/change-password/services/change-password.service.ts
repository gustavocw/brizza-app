import { apiPut } from '@/lib/api'

type ChangePasswordBody = { current_password: string; new_password: string }

/** PUT /user/me/password → 204 (revokes all refresh tokens). Returns ApiResponse. */
export const ChangePasswordService = {
  update: (body: ChangePasswordBody) => apiPut<ChangePasswordBody, void>('/user/me/password', body),
}
