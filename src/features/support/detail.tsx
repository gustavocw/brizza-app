import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { BackButton, Card, Paragraph, Skeleton, Title } from '@/shared/components/ui'
import { fontTheme } from '@/theme/theme'
import { StatusBadge } from './components/status-badge'
import { CATEGORY, ticketDate } from './services/support.dto'
import { useTicketDetail } from './hooks/use-ticket-detail'

/** Ticket detail — UI only. GET /user/me/support/tickets/{id} (with admin response). */
export default function TicketDetailScreen() {
  const { query, ticket } = useTicketDetail()

  return (
    <Screen contentClassName="gap-5 px-4 pt-1">
      <View className="flex-row items-center gap-3">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Chamado
        </Title>
      </View>

      <QueryBoundary query={query} loading={<Skeleton style={{ height: 260, borderRadius: 24 }} />}>
        {ticket ? (
          <View className="gap-4">
            <Card className="gap-3 rounded-3xl border-transparent bg-surface p-4">
              <View className="flex-row items-start gap-2">
                <Title appear={false} className="flex-1 text-lg">
                  {ticket.subject}
                </Title>
                <StatusBadge status={ticket.status} />
              </View>
              <View className="flex-row items-center gap-2">
                <Paragraph appear={false} className="text-xs font-medium text-primary">
                  {CATEGORY[ticket.category]}
                </Paragraph>
                <View className="h-1 w-1 rounded-full bg-border" />
                <Paragraph appear={false} style={{ fontFamily: fontTheme.mono }} className="text-[11px] text-muted">
                  {ticketDate(ticket.created_at)}
                </Paragraph>
              </View>
            </Card>

            <Card className="gap-2 rounded-3xl border-transparent bg-surface p-4">
              <Paragraph appear={false} style={{ fontFamily: fontTheme.monoMedium }} className="text-[11px] uppercase tracking-widest text-subtle">
                Sua mensagem
              </Paragraph>
              <Paragraph appear={false} className="text-[15px] leading-6 text-foreground">
                {ticket.body}
              </Paragraph>
            </Card>

            {ticket.admin_response ? (
              <Card className="gap-2 rounded-3xl border-transparent bg-primarySoft p-4">
                <Paragraph appear={false} style={{ fontFamily: fontTheme.monoMedium }} className="text-[11px] uppercase tracking-widest text-primary">
                  Resposta da equipe
                </Paragraph>
                <Paragraph appear={false} className="text-[15px] leading-6 text-foreground">
                  {ticket.admin_response}
                </Paragraph>
              </Card>
            ) : (
              <Paragraph appear={false} className="px-1 text-sm text-muted">
                Aguardando resposta da equipe.
              </Paragraph>
            )}
          </View>
        ) : null}
      </QueryBoundary>
    </Screen>
  )
}
