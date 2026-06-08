import { apiGet, apiPost } from '@/lib/api'
import type { NewTicketForm, SupportTicket } from './support.dto'

/**
 * Support tickets.
 *   GET  /user/me/support/tickets        → { tickets }
 *   POST /user/me/support/tickets        → SupportTicket
 *   GET  /user/me/support/tickets/{id}   → SupportTicket (with admin_response)
 */
export const SupportService = {
  list: () => apiGet<void, { tickets: SupportTicket[] }>('/user/me/support/tickets'),
  create: (body: NewTicketForm) => apiPost<NewTicketForm, SupportTicket>('/user/me/support/tickets', body),
  detail: (id: string) => apiGet<void, SupportTicket>(`/user/me/support/tickets/${id}`),
}
