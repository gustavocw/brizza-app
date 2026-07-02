import { apiPost, apiPut } from '@/lib/api'
import type { ContactKind } from './change-contact.dto'

/**
 * Change email/phone (2-step, code-confirmed; requesting requires the password).
 *   POST /user/me/email-change/request { new_email, current_password } → code to new address
 *   POST /user/me/phone-change/request { new_phone, current_password } → SMS code
 *   PUT  /user/me/{kind}-change/confirm { code } → applies the change
 */
export const ChangeContactService = {
  request: (kind: ContactKind, value: string, currentPassword: string) =>
    kind === 'email'
      ? apiPost<{ new_email: string; current_password: string }, void>('/user/me/email-change/request', {
          new_email: value,
          current_password: currentPassword,
        })
      : apiPost<{ new_phone: string; current_password: string }, void>('/user/me/phone-change/request', {
          new_phone: value,
          current_password: currentPassword,
        }),
  confirm: (kind: ContactKind, code: string) =>
    apiPut<{ code: string }, void>(`/user/me/${kind}-change/confirm`, { code }),
}
