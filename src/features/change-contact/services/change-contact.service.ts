import { apiPost } from '@/lib/api'
import type { ContactKind } from './change-contact.dto'

/**
 * Change email/phone (2-step, code-confirmed).
 *   POST /user/me/email   { new_email } → code to new address
 *   POST /user/me/phone   { new_phone } → SMS code
 *   POST /user/me/{kind}/confirm { code } → applies the change
 */
export const ChangeContactService = {
  request: (kind: ContactKind, value: string) =>
    kind === 'email'
      ? apiPost<{ new_email: string }, void>('/user/me/email', { new_email: value })
      : apiPost<{ new_phone: string }, void>('/user/me/phone', { new_phone: value }),
  confirm: (kind: ContactKind, code: string) => apiPost<{ code: string }, void>(`/user/me/${kind}/confirm`, { code }),
}
