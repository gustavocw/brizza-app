import type { ApiResponse } from '@/lib/api'
import type { MotoData } from './bike.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED bike. Identity + telemetry (bateria, localização, status) will come from
// the third-party fleet API, which isn't wired to our backend yet — so this
// returns a canned snapshot. To go live, swap snapshot()/link()/unlink() for the
// real /user/me/bike calls; the hook, controller and view stay untouched.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const SNAPSHOT: MotoData = {
  model: 'Brizze S1',
  plate: 'ABC-1234',
  status: 'active',
  lastSeen: 'há 5 min',
  battery: { percent: 74, autonomyKm: 112, healthPct: 98, chargeCycles: 142 },
  telemetry: { odometerKm: 2235, lastRouteKm: 8.4, avgSpeedKmh: 32, motorTempC: 28, motorState: 'Tudo certo' },
  specs: { powerKw: 3, topSpeedKmh: 90, chargeTimeH: 4, weightKg: 78, rangeKm: 120 },
  location: { address: 'Av. Afonso Pena, 1377', updatedAgo: 'há 5 min', lat: -19.922, lng: -43.927 },
}

export const BikeService = {
  async snapshot(): Promise<ApiResponse<MotoData | null>> {
    await delay(500)
    return { success: true, data: SNAPSHOT }
  },
  async link(_body: { plate?: string; qr_code?: string; model?: string }): Promise<ApiResponse<void>> {
    await delay(400)
    return { success: true, data: undefined }
  },
  async unlink(): Promise<ApiResponse<void>> {
    await delay(400)
    return { success: true, data: undefined }
  },
}
