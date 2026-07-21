import { View } from 'react-native'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { BackButton, Button, EmptyState, List, Skeleton, Title } from '@/shared/components/ui'
import { TicketCard } from './components/ticket-card'
import { useSupport } from './hooks/use-support'

/** Support tickets list — UI only. GET /user/me/support/tickets. */
export default function SupportScreen() {
  const { query, tickets, isRefetching, onRefresh, onOpen, onNew } = useSupport()

  return (
    <Screen gradient
      scroll={false}
      dismissKeyboardOnTap={false}
      contentClassName="gap-4 px-0 pt-1"
      footer={<Button label="Abrir chamado" onPress={onNew} />}
    >
      <View className="flex-row items-center gap-3 px-4">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Suporte
        </Title>
      </View>

      <View className="flex-1">
        <QueryBoundary
          query={query}
          isEmpty={tickets.length === 0}
          loading={
            <View className="gap-3 px-4 pt-1">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} style={{ height: 104, borderRadius: 24 }} />
              ))}
            </View>
          }
          empty={
            <EmptyState
              title="Nenhum chamado"
              message="Abra um chamado e a equipe responde por aqui."
            />
          }
        >
          <List
            data={tickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TicketCard ticket={item} onPress={() => onOpen(item.id)} />}
            ItemSeparatorComponent={() => <View className="h-3" />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 2, paddingBottom: 24 }}
            onRefresh={onRefresh}
            refreshing={isRefetching}
          />
        </QueryBoundary>
      </View>
    </Screen>
  )
}
