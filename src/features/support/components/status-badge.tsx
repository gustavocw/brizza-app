import { Badge } from '@/shared/components/ui'
import { STATUS, type TicketStatus } from '../services/support.dto'

/** Ticket status pill (open / in_progress / resolved / closed). */
export function StatusBadge({ status }: { status: TicketStatus }) {
  const cfg = STATUS[status]
  return <Badge tone={cfg.tone} label={cfg.label} />
}
