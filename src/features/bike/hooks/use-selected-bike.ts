import { useBikeStore } from '@/shared/stores/bike.store'
import { useBikesQuery } from './use-bikes-query'

/**
 * The app-wide selected bike, derived from the bikes list + the persisted choice.
 * Falls back to the first bike if the stored id is unknown. Exposes the list and
 * the setter so the switcher can change it; the query is returned for boundaries.
 */
export function useSelectedBike() {
  const selectedId = useBikeStore((s) => s.selectedBikeId)
  const onSelect = useBikeStore((s) => s.setSelectedBike)
  const query = useBikesQuery()

  const bikes = query.data ?? []
  const bike = bikes.find((b) => b.id === selectedId) ?? bikes[0] ?? null

  return { query, bikes, bike, selectedId: bike?.id ?? selectedId, onSelect }
}
