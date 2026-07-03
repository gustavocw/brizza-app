import { useNavigation } from '@/shared/hooks/use-navigation'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useUserLocation } from '@/shared/hooks/use-user-location'
import { useDashboardQuery } from './use-dashboard-query'

/**
 * Dashboard controller. Owns the (mocked) telemetry query and the navigation
 * handlers; the view renders what it returns. The location card shows the user's
 * registered address (TEMPORARY until the fleet API ships the real vehicle GPS);
 * while it resolves, the mocked snapshot location is the fallback.
 */
export function useHome() {
  const nav = useNavigation()
  const user = useAuthStore((s) => s.user)
  const query = useDashboardQuery()
  const { coords, address } = useUserLocation()

  const location =
    coords && address?.street && address.city
      ? {
          address: [address.street, address.number].filter(Boolean).join(', '),
          city: address.city,
          updatedAgo: 'agora',
          latitude: coords.latitude,
          longitude: coords.longitude,
        }
      : (query.data?.location ?? null)

  return {
    query,
    location,
    userName: user?.name ?? 'Piloto',
    onChargeStations: () => nav.push(nav.routes.tabs.charge()),
    onLocation: () => nav.push(nav.routes.tabs.bike()),
  }
}
