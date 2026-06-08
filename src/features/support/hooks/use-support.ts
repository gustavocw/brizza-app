import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { SupportService } from '../services/support.service'

/** Support list controller: tickets + navigation to new/detail. */
export function useSupport() {
  const nav = useNavigation()
  const query = useQuery({
    queryKey: qk.support.list(),
    queryFn: async () => {
      const res = await SupportService.list()
      if (!res.success) throw res.error
      return res.data.tickets
    },
  })

  return {
    query,
    tickets: query.data ?? [],
    isRefetching: query.isRefetching,
    onRefresh: query.refetch,
    onOpen: (id: string) => nav.push(nav.routes.private.supportTicket(id)),
    onNew: () => nav.push(nav.routes.private.supportNew()),
  }
}
