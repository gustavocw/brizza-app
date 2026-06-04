import { useNavigation } from '@/shared/hooks/use-navigation'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useDashboardQuery } from './use-dashboard-query'

/**
 * Dashboard controller. Owns the (mocked) telemetry query and the navigation
 * handlers; the view renders what it returns. The name comes from the signed-in
 * user, the rest from the dashboard snapshot.
 */
export function useHome() {
  const nav = useNavigation()
  const user = useAuthStore((s) => s.user)
  const query = useDashboardQuery()

  return {
    query,
    userName: user?.name ?? 'Piloto',
    onChargeStations: () => nav.push(nav.routes.tabs.charge()),
    onLocation: () => nav.push(nav.routes.tabs.bike()),
  }
}
