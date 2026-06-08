import { z } from 'zod'
import type { BadgeTone } from '@/shared/components/ui'

export type Category = 'account' | 'bike' | 'charging' | 'payment' | 'other'
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export type SupportTicket = {
  id: string
  subject: string
  body: string
  category: Category
  status: TicketStatus
  priority: 'low' | 'normal' | 'high'
  admin_response?: string | null
  responded_at?: string | null
  created_at: string
  updated_at: string
}

export const CATEGORIES: Category[] = ['account', 'bike', 'charging', 'payment', 'other']
export const CATEGORY: Record<Category, string> = {
  account: 'Conta',
  bike: 'Moto',
  charging: 'Recarga',
  payment: 'Pagamento',
  other: 'Outro',
}

export const STATUS: Record<TicketStatus, { label: string; tone: BadgeTone }> = {
  open: { label: 'Aberto', tone: 'info' },
  in_progress: { label: 'Em andamento', tone: 'warning' },
  resolved: { label: 'Resolvido', tone: 'success' },
  closed: { label: 'Fechado', tone: 'neutral' },
}

export const newTicketSchema = z.object({
  category: z.enum(['account', 'bike', 'charging', 'payment', 'other']),
  subject: z.string().trim().min(5, 'Mínimo de 5 caracteres').max(200),
  body: z.string().trim().min(10, 'Descreva com ao menos 10 caracteres').max(5000),
})
export type NewTicketForm = z.infer<typeof newTicketSchema>

export const ticketDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
