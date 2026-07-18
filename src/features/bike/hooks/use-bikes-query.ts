import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { BikeService } from '../services/bike.service'

// READ → useQuery. Unwrap the ApiResponse inside queryFn (throw on failure) so
// React Query's loading/error state works. Mocked bikes (see service).
export function useBikesQuery() {
  return useQuery({
    queryKey: qk.bike.list(),
    queryFn: async () => {
      const res = await BikeService.list()
      if (!res.success) throw res.error
      return res.data
    },
  })
}
