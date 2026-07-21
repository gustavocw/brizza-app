import type { ApiResponse } from '@/lib/api'
import type { MotoData } from './bike.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED bikes. Identity + telemetry (bateria, localização, status) will come from
// the third-party fleet API, which isn't wired to our backend yet — so this
// returns canned bikes. Four models (the client's standardized photos) so the bike
// switcher has something to switch between. To go live, swap list()/link()/unlink()
// for the real /user/me/bike calls; the hooks, controller and views stay untouched.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOTO_CITY = require('../../../../assets/motos/1.jpeg')
const MOTO_CLASSIC = require('../../../../assets/motos/2.jpeg')
const MOTO_STREET = require('../../../../assets/motos/3.jpeg')
const MOTO_CAFE = require('../../../../assets/motos/4.jpeg')

const BIKES: MotoData[] = [
  {
    id: 'bike-1',
    model: 'Brizze City',
    plate: 'ABC-1234',
    image: MOTO_CITY,
    status: 'active',
    lastSeen: 'há 5 min',
    battery: { percent: 74, autonomyKm: 82, healthPct: 98, chargeCycles: 142 },
    telemetry: { odometerKm: 2235, lastRouteKm: 8.4, avgSpeedKmh: 28, motorTempC: 28, motorState: 'Tudo certo' },
    specs: { powerKw: 2, topSpeedKmh: 60, chargeTimeH: 4, weightKg: 65, rangeKm: 90 },
    location: { address: 'Av. Afonso Pena, 1377', updatedAgo: 'há 5 min', lat: -19.922, lng: -43.927 },
  },
  {
    id: 'bike-2',
    model: 'Brizze Classic',
    plate: 'DEF-5678',
    image: MOTO_CLASSIC,
    status: 'active',
    lastSeen: 'há 12 min',
    battery: { percent: 88, autonomyKm: 105, healthPct: 95, chargeCycles: 96 },
    telemetry: { odometerKm: 1180, lastRouteKm: 6.2, avgSpeedKmh: 34, motorTempC: 30, motorState: 'Tudo certo' },
    specs: { powerKw: 3, topSpeedKmh: 80, chargeTimeH: 4, weightKg: 82, rangeKm: 110 },
    location: { address: 'Praça Sete de Setembro, 20', updatedAgo: 'há 12 min', lat: -19.919, lng: -43.938 },
  },
  {
    id: 'bike-3',
    model: 'Brizze Street',
    plate: 'GHI-9012',
    image: MOTO_STREET,
    status: 'charging',
    lastSeen: 'há 2 min',
    battery: { percent: 46, autonomyKm: 88, healthPct: 89, chargeCycles: 260 },
    telemetry: { odometerKm: 7890, lastRouteKm: 15.1, avgSpeedKmh: 44, motorTempC: 33, motorState: 'Tudo certo' },
    specs: { powerKw: 6, topSpeedKmh: 110, chargeTimeH: 5, weightKg: 95, rangeKm: 150 },
    location: { address: 'Av. do Contorno, 6061', updatedAgo: 'há 2 min', lat: -19.933, lng: -43.945 },
  },
  {
    id: 'bike-4',
    model: 'Brizze Café',
    plate: 'JKL-3456',
    image: MOTO_CAFE,
    status: 'active',
    lastSeen: 'há 20 min',
    battery: { percent: 63, autonomyKm: 140, healthPct: 93, chargeCycles: 180 },
    telemetry: { odometerKm: 4310, lastRouteKm: 22.6, avgSpeedKmh: 52, motorTempC: 36, motorState: 'Tudo certo' },
    specs: { powerKw: 8, topSpeedKmh: 130, chargeTimeH: 6, weightKg: 110, rangeKm: 180 },
    location: { address: 'Rua Sapucaí, 383', updatedAgo: 'há 20 min', lat: -19.912, lng: -43.932 },
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
