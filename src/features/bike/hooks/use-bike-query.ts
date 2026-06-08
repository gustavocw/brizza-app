import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { BikeService } from '../services/bike.service'

// READ → useQuery. Unwrap the ApiResponse inside queryFn (throw on failure) so
// React Query's loading/error state works. Mocked bike snapshot (see service).
export function useBikeQuery() {
  return useQuery({
    queryKey: qk.bike.detail(),
    queryFn: async () => {
      const res = await BikeService.snapshot()
      if (!res.success) throw res.error
      return res.data
    },
  })
}
