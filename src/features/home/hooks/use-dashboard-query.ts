import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { useSelectedBike } from '@/features/bike/hooks/use-selected-bike'
import { DashboardService } from '../services/dashboard.service'

// READ → useQuery. Keyed by the RESOLVED selected bike (same source as the header
// and Motor screen, so they can never point at different bikes). keepPreviousData
// keeps the current bike's overview on screen during a switch instead of tearing
// down to a skeleton. Unwrap the ApiResponse in queryFn (throw on failure) so
// React Query's loading/error state works.
export function useDashboardQuery() {
  const { selectedId } = useSelectedBike()
  return useQuery({
    queryKey: qk.dashboard.summary(selectedId),
    queryFn: async () => {
      const res = await DashboardService.summary(selectedId)
      if (!res.success) throw res.error
      return res.data
    },
    placeholderData: keepPreviousData,
  })
}
