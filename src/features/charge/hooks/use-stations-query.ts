import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { ChargeService } from '../services/charge.service'
import type { LatLng } from '../services/station.dto'

// READ → useQuery. Unwrap the ApiResponse inside queryFn (throw on failure) so
// React Query's loading/error state works. Nearby stations from the live API.
export function useStationsQuery(location: LatLng) {
  return useQuery({
    queryKey: qk.charge.stations({ lat: location.latitude, lng: location.longitude }),
    queryFn: async () => {
      const res = await ChargeService.nearby({ lat: location.latitude, lng: location.longitude })
      if (!res.success) throw res.error
      return res.data
    },
  })
}
