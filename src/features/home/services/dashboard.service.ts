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

const MOTO1 = require('../../../../assets/moto.png')
const MOTO2 = require('../../../../assets/moto2.png')

const SNAPSHOTS: Record<string, DashboardData> = {
  'bike-1': {
    image: MOTO1,
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
  },
  'bike-2': {
    image: MOTO2,
    battery: { percent: 52, autonomyKm: 95, healthPct: 91, chargeCycles: 210, status: 'parked' },
    lastRoute: { distanceKm: 12.3, when: 'hoje' },
    odometerKm: 5480,
    avgSpeedKmh: 41,
    co2SavedKg: 210,
    motor: { state: 'Tudo certo', tempC: 34 },
    specs: { powerKw: 6, topSpeedKmh: 110, rangeKm: 150, weightKg: 92, chargeTimeH: 5 },
    nextService: { km: 6000, days: 45 },
    checks: { system: 'ok', battery: 'ok', motor: 'ok', brakes: 'ok', tires: 'ok' },
    location: {
      address: 'Av. Getúlio Vargas, 1200',
      city: 'Belo Horizonte',
      updatedAgo: 'agora',
      latitude: -19.94,
      longitude: -43.933,
    },
  },
}

export const DashboardService = {
  async summary(bikeId: string): Promise<ApiResponse<DashboardData>> {
    await delay(700)
    return { success: true, data: SNAPSHOTS[bikeId] ?? SNAPSHOTS['bike-1'] }
  },
}
