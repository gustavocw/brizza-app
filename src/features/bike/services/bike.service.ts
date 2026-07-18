import type { ApiResponse } from '@/lib/api'
import type { MotoData } from './bike.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED bikes. Identity + telemetry (bateria, localização, status) will come from
// the third-party fleet API, which isn't wired to our backend yet — so this
// returns canned bikes. Two models so the bike switcher has something to switch to.
// To go live, swap list()/link()/unlink() for the real /user/me/bike calls; the
// hooks, controller and views stay untouched.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOTO1 = require('../../../../assets/moto.png')
const MOTO2 = require('../../../../assets/moto2.png')

const BIKES: MotoData[] = [
  {
    id: 'bike-1',
    model: 'Brizze S1',
    plate: 'ABC-1234',
    image: MOTO1,
    status: 'active',
    lastSeen: 'há 5 min',
    battery: { percent: 74, autonomyKm: 112, healthPct: 98, chargeCycles: 142 },
    telemetry: { odometerKm: 2235, lastRouteKm: 8.4, avgSpeedKmh: 32, motorTempC: 28, motorState: 'Tudo certo' },
    specs: { powerKw: 3, topSpeedKmh: 90, chargeTimeH: 4, weightKg: 78, rangeKm: 120 },
    location: { address: 'Av. Afonso Pena, 1377', updatedAgo: 'há 5 min', lat: -19.922, lng: -43.927 },
  },
  {
    id: 'bike-2',
    model: 'Brizze X1',
    plate: 'DEF-5678',
    image: MOTO2,
    status: 'active',
    lastSeen: 'há 12 min',
    battery: { percent: 52, autonomyKm: 95, healthPct: 91, chargeCycles: 210 },
    telemetry: { odometerKm: 5480, lastRouteKm: 12.3, avgSpeedKmh: 41, motorTempC: 34, motorState: 'Tudo certo' },
    specs: { powerKw: 6, topSpeedKmh: 110, chargeTimeH: 5, weightKg: 92, rangeKm: 150 },
    location: { address: 'Av. Getúlio Vargas, 1200', updatedAgo: 'há 12 min', lat: -19.94, lng: -43.933 },
  },
]

export const BikeService = {
  async list(): Promise<ApiResponse<MotoData[]>> {
    await delay(500)
    return { success: true, data: BIKES }
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
