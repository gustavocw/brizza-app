export type VehicleStatus = 'parked' | 'moving' | 'charging'

/** The dashboard snapshot (battery, motor, last route, location). */
export type DashboardData = {
  vehicle: { model: string; plate: string }
  battery: { percent: number; autonomyKm: number; status: VehicleStatus }
  motor: { state: string; tempC: number }
  lastRoute: { distanceKm: number; when: string }
  odometerKm: number
  location: { address: string; city: string; updatedAgo: string; latitude: number; longitude: number }
}
