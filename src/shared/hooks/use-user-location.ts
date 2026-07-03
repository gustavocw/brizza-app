import { useQuery } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { onlyDigits } from '@/shared/utils/masks'
import { geocodeAddress, type GeoPoint } from '@/shared/utils/geocode'
import { useMeQuery } from '@/features/profile/hooks/use-me-query'

/**
 * TEMPORARY map location: geocodes the signed-in user's registered address so the
 * maps (home + charge) center on it. When the third-party fleet API ships the real
 * vehicle GPS, swap the consumers to that source — this hook and its callers keep
 * the same { coords, address } shape.
 */
export function useUserLocation() {
  const me = useMeQuery()
  const address = me.data?.address ?? null
  const cacheKey = address ? onlyDigits(address.zip ?? '') || `${address.street}-${address.number}` : 'none'

  const query = useQuery<GeoPoint | null>({
    queryKey: qk.me.location(cacheKey),
    enabled: !!address?.street && !!address?.city,
    // An address rarely moves; a changed address gets its own cache key anyway.
    staleTime: Infinity,
    queryFn: () =>
      geocodeAddress({
        street: address?.street,
        number: address?.number,
        city: address?.city,
        state: address?.state,
      }),
  })

  return { coords: query.data ?? null, address }
}
