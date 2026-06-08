import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { ProfileService } from '../services/profile.service'

// READ → useQuery. Unwrap the ApiResponse inside queryFn (throw on failure) so
// React Query's loading/error state works. The signed-in user's full profile.
export function useMeQuery() {
  return useQuery({
    queryKey: qk.me.profile(),
    queryFn: async () => {
      const res = await ProfileService.me()
      if (!res.success) throw res.error
      return res.data
    },
  })
}
