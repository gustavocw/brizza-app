import type { ApiResponse } from '@/lib/api'
import type { DashboardData } from './dashboard.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED dashboard telemetry. The blueprint flags live battery / autonomy / GPS
// as the open hardware integration, so this returns a canned snapshot after a
// short delay. To go live, swap for the real call, e.g.
//   apiGet<void, DashboardData>('/vehicles/me/telemetry')
// and delete the mock — the hook, controller and view stay untouched.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const SNAPSHOT: DashboardData = {
  vehicle: { model: 'Brizze S1', plate: 'ABC-1234' },
  battery: { percent: 74, autonomyKm: 112, status: 'parked' },
  motor: { state: 'Tudo certo', tempC: 28 },
  lastRoute: { distanceKm: 8.4, when: 'hoje' },
  odometerKm: 2235,
  location: {
    address: 'Rua das Flores, 142',
    city: 'Belo Horizonte',
    updatedAgo: 'agora',
    latitude: -19.932,
    longitude: -43.9377,
  },
}

export const DashboardService = {
  async summary(): Promise<ApiResponse<DashboardData>> {
    await delay(700)
    return { success: true, data: SNAPSHOT }
  },
}
