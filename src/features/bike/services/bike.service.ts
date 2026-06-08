import type { ApiResponse } from '@/lib/api'
import type { MotoData } from './bike.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED bike. The blueprint (and the backend's own BikeStatus) flag telemetry as
// the open hardware integration, so this returns a canned snapshot. To go live,
// fetch /user/me/bike + /user/me/bike/status and merge them — the hook, controller
// and view stay untouched.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const SNAPSHOT: MotoData = {
  model: 'Brisa S1',
  plate: 'ABC-1234',
  status: 'parked',
  lastSeen: 'há 5 min',
  battery: { percent: 74, autonomyKm: 112, healthPct: 98, chargeCycles: 142 },
  telemetry: { odometerKm: 2235, lastRouteKm: 8.4, avgSpeedKmh: 32, motorTempC: 28, motorState: 'Tudo certo' },
  specs: { powerKw: 3, topSpeedKmh: 90, chargeTimeH: 4, weightKg: 78, rangeKm: 120 },
  location: { address: 'Av. Afonso Pena, 1377', updatedAgo: 'há 5 min', lat: -19.922, lng: -43.927 },
}

export const BikeService = {
  async snapshot(): Promise<ApiResponse<MotoData>> {
    await delay(600)
    return { success: true, data: SNAPSHOT }
  },
}
