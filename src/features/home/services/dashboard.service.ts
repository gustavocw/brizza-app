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
  battery: { percent: 74, autonomyKm: 112, healthPct: 98, chargeCycles: 142, status: 'parked' },
  lastRoute: { distanceKm: 8.4, when: 'hoje' },
  odometerKm: 2235,
  avgSpeedKmh: 32,
  co2SavedKg: 128,
  motor: { state: 'Tudo certo', tempC: 28 },
  specs: { powerKw: 3, topSpeedKmh: 90, rangeKm: 120, weightKg: 78, chargeTimeH: 4 },
  nextService: { km: 2500, days: 30 },
  checks: { system: 'ok', battery: 'attention', motor: 'ok', brakes: 'problem', tires: 'attention' },
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
