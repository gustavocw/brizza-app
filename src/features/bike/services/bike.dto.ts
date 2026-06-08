// Contract for the user's motorcycle. Merges the Brizza API `Bike` (identity) and
// `BikeStatus` (MOCK telemetry) schemas — `GET /user/me/bike` + `/bike/status`.
// Data is mocked for now (see bike.service.ts) but typed to swap in the real calls.

export type BikeStatusKind = 'parked' | 'moving' | 'charging'

export type MotoData = {
  model: string
  plate: string
  status: BikeStatusKind
  lastSeen: string
  battery: { percent: number; autonomyKm: number; healthPct: number; chargeCycles: number }
  telemetry: { odometerKm: number; lastRouteKm: number; avgSpeedKmh: number; motorTempC: number; motorState: string }
  specs: { powerKw: number; topSpeedKmh: number; chargeTimeH: number; weightKg: number; rangeKm: number }
  location: { address: string; updatedAgo: string; lat: number; lng: number }
}

export const STATUS: Record<BikeStatusKind, { label: string; dot: string }> = {
  parked: { label: 'Estacionada', dot: 'bg-accent' },
  moving: { label: 'Em movimento', dot: 'bg-accent' },
  charging: { label: 'Carregando', dot: 'bg-warning' },
}

export const numberToBR = (n: number) => n.toLocaleString('pt-BR')

/** Google Maps link that SHOWS the bike's current location (not directions). */
export const mapsViewUrl = (loc: Pick<MotoData['location'], 'lat' | 'lng'>) =>
  `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`
