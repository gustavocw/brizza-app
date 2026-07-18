import type { ImageSourcePropType } from 'react-native'

export type VehicleStatus = 'parked' | 'moving' | 'charging'

/** Each quick health check: fine, needs attention, or has a problem. */
export type CheckStatus = 'ok' | 'attention' | 'problem'

/**
 * The dashboard snapshot — the app's "overview". Identity + battery + glanceable
 * metrics + quick health checks. Deep motor/spec detail lives on the Motor screen
 * (MotoData), not here, to avoid duplicating the same data across both tabs.
 */
export type DashboardData = {
  /** Bike photo for the home banner (mock-only: bundled asset). */
  image: ImageSourcePropType
  battery: { percent: number; autonomyKm: number; healthPct: number; chargeCycles: number; status: VehicleStatus }
  lastRoute: { distanceKm: number; when: string }
  odometerKm: number
  avgSpeedKmh: number
  co2SavedKg: number
  motor: { state: string; tempC: number }
  specs: { powerKw: number; topSpeedKmh: number; rangeKm: number; weightKg: number; chargeTimeH: number }
  nextService: { km: number; days: number }
  checks: {
    system: CheckStatus
    battery: CheckStatus
    motor: CheckStatus
    brakes: CheckStatus
    tires: CheckStatus
  }
  location: { address: string; city: string; updatedAgo: string; latitude: number; longitude: number }
}
