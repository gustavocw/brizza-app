import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { qk } from '@/lib/query-keys'
import { SupportService } from '../services/support.service'

/** Ticket detail controller: reads the `id` param and fetches the ticket. */
export function useTicketDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const query = useQuery({
    queryKey: qk.support.detail(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      const res = await SupportService.detail(id as string)
      if (!res.success) throw res.error
      return res.data
    },
  })
  return { query, ticket: query.data }
}
