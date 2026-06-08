import { Pressable, View } from 'react-native'
import { Paragraph } from '@/shared/components/ui'
import { fontTheme } from '@/theme/theme'
import { StatusBadge } from './status-badge'
import { CATEGORY, ticketDate, type SupportTicket } from '../services/support.dto'

/** One ticket in the list: subject + status, a preview, category and date. */
export function TicketCard({ ticket, onPress }: { ticket: SupportTicket; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="gap-2 rounded-3xl bg-surface p-4">
      <View className="flex-row items-start gap-2">
        <Paragraph appear={false} numberOfLines={1} className="flex-1 font-semibold text-foreground">
          {ticket.subject}
        </Paragraph>
        <StatusBadge status={ticket.status} />
      </View>
      <Paragraph appear={false} numberOfLines={2} className="text-sm text-muted">
        {ticket.body}
      </Paragraph>
      <View className="flex-row items-center gap-2">
        <Paragraph appear={false} className="text-xs font-medium text-primary">
          {CATEGORY[ticket.category]}
        </Paragraph>
        <View className="h-1 w-1 rounded-full bg-border" />
        <Paragraph appear={false} style={{ fontFamily: fontTheme.mono }} className="text-[11px] text-muted">
          {ticketDate(ticket.created_at)}
        </Paragraph>
      </View>
    </Pressable>
  )
}
