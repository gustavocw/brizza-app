import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { ChargeService } from '../services/charge.service'

// READ → useQuery. Unwrap the ApiResponse inside queryFn (throw on failure) so
// React Query's loading/error state works. Mocked nearby stations (see service).
export function useStationsQuery() {
  return useQuery({
    queryKey: qk.charge.stations(),
    queryFn: async () => {
      const res = await ChargeService.nearby()
      if (!res.success) throw res.error
      return res.data
    },
  })
}
