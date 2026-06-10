import { apiPost, apiPut } from '@/lib/api'
import type { VerifyKind } from './verify.dto'

/**
 * Account verification.
 *   POST /verify/request/{kind} → 204 (sends a code to the user's email/phone)
 *   PUT  /verify/{kind} ({ code }) → 204
 */
export const VerifyService = {
  request: (kind: VerifyKind) => apiPost<void, void>(`/verify/request/${kind}`),
  confirm: (kind: VerifyKind, code: string) => apiPut<{ code: string }, void>(`/verify/${kind}`, { code }),
}
