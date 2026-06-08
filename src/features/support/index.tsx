import { Pressable, View } from 'react-native'
import { AddCircle } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { BackButton, EmptyState, List, Paragraph, Skeleton, Title } from '@/shared/components/ui'
import { useColors } from '@/theme/use-colors'
import { TicketCard } from './components/ticket-card'
import { useSupport } from './hooks/use-support'

/** Support tickets list — UI only. GET /user/me/support/tickets. */
export default function SupportScreen() {
  const colors = useColors()
  const { query, tickets, isRefetching, onRefresh, onOpen, onNew } = useSupport()

  return (
    <Screen scroll={false} dismissKeyboardOnTap={false} contentClassName="gap-4 px-0 pt-1">
      <View className="flex-row items-center gap-3 px-4">
        <BackButton />
        <Title numberOfLines={1} className="flex-1 text-xl">
          Suporte
        </Title>
        <Pressable onPress={onNew} hitSlop={8} className="flex-row items-center gap-1.5">
          <AddCircle size={20} color={colors.primary} variant="Bold" />
          <Paragraph appear={false} className="font-medium text-primary">
            Novo
          </Paragraph>
        </Pressable>
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
              action={{ label: 'Abrir chamado', onPress: onNew }}
            />
          }
        >
          <List
            data={tickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TicketCard ticket={item} onPress={() => onOpen(item.id)} />}
            ItemSeparatorComponent={() => <View className="h-3" />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 2, paddingBottom: 140 }}
            onRefresh={onRefresh}
            refreshing={isRefetching}
          />
        </QueryBoundary>
      </View>
    </Screen>
  )
}
