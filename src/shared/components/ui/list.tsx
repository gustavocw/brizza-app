import { RefreshControl } from 'react-native'
import { FlashList, type FlashListProps } from '@shopify/flash-list'
import { useColors } from '@/theme/use-colors'

export type ListProps<T> = FlashListProps<T> & {
  onRefresh?: () => void
  refreshing?: boolean
}

/**
 * FlashList with sane defaults (pull-to-refresh, keyboard-aware taps). Use this
 * for any long list — never a ScrollView with .map(). Pair with useInfiniteList:
 *
 *   <List data={list.items} renderItem={...} onEndReached={list.loadMore}
 *         onRefresh={list.refetch} refreshing={list.isRefetching} />
 */
export function List<T>({ onRefresh, refreshing = false, ...rest }: ListProps<T>) {
  const colors = useColors()
  return (
    <FlashList
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      onEndReachedThreshold={0.5}
      refreshControl={
        onRefresh ? (
          // Brand-tokenized spinner: tintColor = iOS, colors = Android arrow, puck = surface.
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        ) : undefined
      }
      {...rest}
    />
  )
}
