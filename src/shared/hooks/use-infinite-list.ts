import { useInfiniteQuery, type QueryKey } from '@tanstack/react-query'
import type { ApiResponse } from '@/lib/api'
import { extractList, extractMeta } from '@/shared/utils/api.utils'

type PageParams = { page: number; limit: number }

/**
 * Paginated/infinite list on top of useInfiniteQuery + the ApiResponse contract.
 * Replaces the hand-rolled pagination both source apps carried.
 *
 *   const list = useInfiniteList<Example>({
 *     queryKey: qk.example.list({ search }),
 *     fetchPage: ({ page, limit }) => ExampleService.list({ page, limit, search }),
 *   })
 *   <List data={list.items} onEndReached={list.loadMore} refreshing={list.isRefetching} onRefresh={list.refetch} />
 */
export function useInfiniteList<T>({
  queryKey,
  fetchPage,
  limit = 20,
  enabled = true,
}: {
  queryKey: QueryKey
  fetchPage: (params: PageParams) => Promise<ApiResponse<unknown>>
  limit?: number
  enabled?: boolean
}) {
  const query = useInfiniteQuery({
    queryKey,
    enabled,
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => {
      const res = await fetchPage({ page: pageParam as number, limit })
      if (!res.success) throw res.error
      return { items: extractList<T>(res.data), meta: extractMeta(res.data, limit) }
    },
    getNextPageParam: (last) => (last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined),
  })

  const items = (query.data?.pages ?? []).flatMap((p) => p.items)

  return {
    ...query,
    items,
    loadMore: () => {
      if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage()
    },
  }
}
