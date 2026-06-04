import type { ReactNode } from 'react'
import { View } from 'react-native'
import { Button } from '@/shared/components/ui/button'
import { EmptyState } from '@/shared/components/ui/empty-state'
import { Paragraph } from '@/shared/components/ui/paragraph'
import { Skeleton } from '@/shared/components/ui/skeleton'

type QueryLike = { isPending: boolean; isError: boolean; refetch?: () => void }

/**
 * Standard loading / error / empty / content states for a query.
 *
 *   <QueryBoundary query={query} isEmpty={items.length === 0}>
 *     {items.map(...)}
 *   </QueryBoundary>
 */
export function QueryBoundary({
  query,
  isEmpty = false,
  loading,
  empty,
  children,
}: {
  query: QueryLike
  isEmpty?: boolean
  loading?: ReactNode
  empty?: ReactNode
  children: ReactNode
}) {
  if (query.isPending) {
    return (
      loading ?? (
        <View className="gap-3 p-4">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} style={{ height: 72 }} />
          ))}
        </View>
      )
    )
  }

  if (query.isError) {
    return (
      <View className="flex-1 items-center justify-center gap-3 p-8">
        <Paragraph appear={false} className="text-center text-muted">
          Não foi possível carregar.
        </Paragraph>
        {query.refetch ? (
          <Button full={false} variant="secondary" label="Tentar de novo" onPress={query.refetch} />
        ) : null}
      </View>
    )
  }

  if (isEmpty) return empty ?? <EmptyState title="Nada aqui ainda" />

  return <>{children}</>
}
