import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { LegalService } from '../services/legal.service'
import type { LegalKind } from '../services/legal.dto'

// READ → useQuery. Unwrap inside queryFn (throw on failure) so loading/error work.
export function useLegalQuery(kind: LegalKind) {
  return useQuery({
    queryKey: qk.legal.doc(kind),
    queryFn: async () => {
      const res = await LegalService.current(kind)
      if (!res.success) throw res.error
      return res.data
    },
    staleTime: 1000 * 60 * 60, // legal docs rarely change within a session
  })
}
