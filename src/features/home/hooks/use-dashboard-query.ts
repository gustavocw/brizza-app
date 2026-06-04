import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { DashboardService } from '../services/dashboard.service'

// READ → useQuery. Unwrap the ApiResponse inside queryFn (throw on failure) so
// React Query's loading/error state works.
export function useDashboardQuery() {
  return useQuery({
    queryKey: qk.dashboard.summary(),
    queryFn: async () => {
      const res = await DashboardService.summary()
      if (!res.success) throw res.error
      return res.data
    },
  })
}
