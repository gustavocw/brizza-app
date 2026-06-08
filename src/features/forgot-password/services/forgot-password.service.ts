import { apiPost } from '@/lib/api'
import { isEmail } from './forgot-password.dto'

type ResetBody = { identifier: string; code: string; new_password: string }

/**
 * Password recovery (public endpoints). Returns ApiResponse (never throws).
 *   POST /auth/forgot-password { email | phone } → 204 (always, anti-enum)
 *   POST /auth/reset-password  { identifier, code, new_password } → 204
 */
export const ForgotPasswordService = {
  requestCode: (identifier: string) =>
    apiPost<Record<string, string>, void>(
      '/auth/forgot-password',
      isEmail(identifier) ? { email: identifier } : { phone: identifier },
    ),
  reset: (body: ResetBody) => apiPost<ResetBody, void>('/auth/reset-password', body),
}
