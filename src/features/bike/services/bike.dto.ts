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

/** "agora" / "há 5 min" / "há 2 h" from an ISO timestamp. */
export function relSeen(iso?: string | null): string {
  if (!iso) return 'agora'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return 'agora'
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (s < 60) return 'agora'
  const m = Math.floor(s / 60)
  if (m < 60) return `há ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `há ${h} h`
  return `há ${Math.floor(h / 24)} d`
}

/** Google Maps link that SHOWS the bike's current location (not directions). */
export const mapsViewUrl = (loc: Pick<MotoData['location'], 'lat' | 'lng'>) =>
  `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`
