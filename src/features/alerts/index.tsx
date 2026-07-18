import { ActivityIndicator, Pressable, View } from 'react-native'
import { TickCircle } from 'iconsax-react-nativejs'
import { Screen } from '@/shared/components/layout/screen'
import { QueryBoundary } from '@/shared/components/data/query-boundary'
import { List, Paragraph } from '@/shared/components/ui'
import { MotoHeader } from '@/shared/components/moto/moto-header'
import { useColors } from '@/theme/use-colors'
import { NotificationRow } from './components/notification-row'
import { NotificationsEmpty } from './components/notifications-empty'
import { NotificationsSkeleton } from './components/notifications-skeleton'
import { unreadLabel } from './services/notification.dto'
import { useAlerts } from './hooks/use-alerts'

/**
 * Alerts view — UI only. Data + handlers come from useAlerts(). A cursor-paginated
 * notification feed (pull to refresh, infinite scroll) wired to the Brizze API.
 * Bottom padding clears the floating tab bar.
 */
export default function AlertsScreen() {
  const colors = useColors()
  const { query, items, unreadCount, isRefetching, isFetchingNextPage, onRefresh, loadMore, onPressItem, onOptions, onMarkAll } =
    useAlerts()

  return (
    <Screen scroll={false} dismissKeyboardOnTap={false} contentClassName="gap-4 px-0 pt-1">
      <View className="px-4">
        <MotoHeader />
      </View>

      <View className="flex-row items-center justify-between px-4">
        <Paragraph appear={false} className="text-muted">
          {unreadLabel(unreadCount)}
        </Paragraph>
        {unreadCount > 0 ? (
          <Pressable onPress={onMarkAll} hitSlop={8} className="flex-row items-center gap-1.5">
            <TickCircle size={18} color={colors.primary} variant="Bold" />
            <Paragraph appear={false} className="font-medium text-primary">
              Marcar todas
            </Paragraph>
          </Pressable>
        ) : null}
      </View>

      <View className="flex-1">
        <QueryBoundary
          query={query}
          isEmpty={items.length === 0}
          loading={<NotificationsSkeleton />}
          empty={<NotificationsEmpty />}
        >
          <List
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationRow notification={item} onPress={() => onPressItem(item)} onOptions={() => onOptions(item)} />
            )}
            ItemSeparatorComponent={() => <View className="h-3" />}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 140 }}
            onEndReached={loadMore}
            onRefresh={onRefresh}
            refreshing={isRefetching}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View className="py-6">
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : null
            }
          />
        </QueryBoundary>
      </View>
    </Screen>
  )
}
