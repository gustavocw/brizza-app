import type { ApiResponse } from '@/lib/api'
import type { DashboardData } from './dashboard.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED dashboard telemetry, keyed by bike id so switching bikes swaps the whole
// overview. The blueprint flags live battery / autonomy / GPS as the open hardware
// integration, so this returns a canned snapshot after a short delay. To go live,
// swap for the real call, e.g. apiGet('/vehicles/:id/telemetry'); the hook,
// controller and view stay untouched. Keep in sync with bike.service.ts BIKES.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOTO_CITY = require('../../../../assets/motos/1.jpeg')
const MOTO_CLASSIC = require('../../../../assets/motos/2.jpeg')
const MOTO_STREET = require('../../../../assets/motos/3.jpeg')
const MOTO_CAFE = require('../../../../assets/motos/4.jpeg')

const SNAPSHOTS: Record<string, DashboardData> = {
  'bike-1': {
    image: MOTO_CITY,
    battery: { percent: 74, autonomyKm: 82, healthPct: 98, chargeCycles: 142, status: 'parked' },
    lastRoute: { distanceKm: 8.4, when: 'hoje' },
    odometerKm: 2235,
    avgSpeedKmh: 28,
    co2SavedKg: 128,
    motor: { state: 'Tudo certo', tempC: 28 },
    specs: { powerKw: 2, topSpeedKmh: 60, rangeKm: 90, weightKg: 65, chargeTimeH: 4 },
    nextService: { km: 2500, days: 30 },
    checks: { system: 'ok', battery: 'attention', motor: 'ok', brakes: 'problem', tires: 'attention' },
    location: {
      address: 'Av. Afonso Pena, 1377',
      city: 'Belo Horizonte',
      updatedAgo: 'agora',
      latitude: -19.922,
      longitude: -43.927,
    },
  },
  'bike-2': {
    image: MOTO_CLASSIC,
    battery: { percent: 88, autonomyKm: 105, healthPct: 95, chargeCycles: 96, status: 'parked' },
    lastRoute: { distanceKm: 6.2, when: 'hoje' },
    odometerKm: 1180,
    avgSpeedKmh: 34,
    co2SavedKg: 96,
    motor: { state: 'Tudo certo', tempC: 30 },
    specs: { powerKw: 3, topSpeedKmh: 80, rangeKm: 110, weightKg: 82, chargeTimeH: 4 },
    nextService: { km: 3000, days: 40 },
    checks: { system: 'ok', battery: 'ok', motor: 'ok', brakes: 'ok', tires: 'ok' },
    location: {
      address: 'Praça Sete de Setembro, 20',
      city: 'Belo Horizonte',
      updatedAgo: 'agora',
      latitude: -19.919,
      longitude: -43.938,
    },
  },
  'bike-3': {
    image: MOTO_STREET,
    battery: { percent: 46, autonomyKm: 88, healthPct: 89, chargeCycles: 260, status: 'charging' },
    lastRoute: { distanceKm: 15.1, when: 'hoje' },
    odometerKm: 7890,
    avgSpeedKmh: 44,
    co2SavedKg: 268,
    motor: { state: 'Tudo certo', tempC: 33 },
    specs: { powerKw: 6, topSpeedKmh: 110, rangeKm: 150, weightKg: 95, chargeTimeH: 5 },
    nextService: { km: 8000, days: 60 },
    checks: { system: 'ok', battery: 'ok', motor: 'ok', brakes: 'attention', tires: 'ok' },
    location: {
      address: 'Av. do Contorno, 6061',
      city: 'Belo Horizonte',
      updatedAgo: 'agora',
      latitude: -19.933,
      longitude: -43.945,
    },
  },
  'bike-4': {
    image: MOTO_CAFE,
    battery: { percent: 63, autonomyKm: 140, healthPct: 93, chargeCycles: 180, status: 'parked' },
    lastRoute: { distanceKm: 22.6, when: 'hoje' },
    odometerKm: 4310,
    avgSpeedKmh: 52,
    co2SavedKg: 342,
    motor: { state: 'Tudo certo', tempC: 36 },
    specs: { powerKw: 8, topSpeedKmh: 130, rangeKm: 180, weightKg: 110, chargeTimeH: 6 },
    nextService: { km: 5000, days: 50 },
    checks: { system: 'ok', battery: 'ok', motor: 'ok', brakes: 'ok', tires: 'attention' },
    location: {
      address: 'Rua Sapucaí, 383',
      city: 'Belo Horizonte',
      updatedAgo: 'agora',
      latitude: -19.912,
      longitude: -43.932,
    },
  },
}

export const DashboardService = {
  async summary(bikeId: string): Promise<ApiResponse<DashboardData>> {
    await delay(700)
    return { success: true, data: SNAPSHOTS[bikeId] ?? SNAPSHOTS['bike-1'] }
  },
}
