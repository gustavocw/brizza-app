// Contract for charging stations. Matches the RUNNING `GET /charging-stations`
// response (verified live), which differs from the OpenAPI `ChargingStation`
// schema: the API returns price_per_kwh + total_slots/available_slots/is_open
// (not price_brl + availability). Availability is derived client-side.

export type Availability = 'available' | 'busy' | 'offline'

export type ChargingStation = {
  id: string
  name: string
  address: string
  city?: string
  state?: string
  lat: number
  lng: number
  distance_km: number
  total_slots: number
  available_slots: number
  price_per_kwh: number
  is_open: boolean
}

export type LatLng = { latitude: number; longitude: number }

/** available = open with free slots · busy = open but full · offline = closed. */
export function availabilityOf(s: ChargingStation): Availability {
  if (!s.is_open) return 'offline'
  return s.available_slots > 0 ? 'available' : 'busy'
}

const TONE: Record<Availability, { dot: string; text: string }> = {
  available: { dot: 'bg-success', text: 'text-success' },
  busy: { dot: 'bg-warning', text: 'text-warning' },
  offline: { dot: 'bg-subtle', text: 'text-subtle' },
}
export const availabilityTone = (a: Availability) => TONE[a]

/** Slot-aware status label: "4 vagas" / "Lotada" / "Fechada". */
export function availabilityLabel(s: ChargingStation): string {
  const a = availabilityOf(s)
  if (a === 'offline') return 'Fechada'
  if (a === 'busy') return 'Lotada'
  return `${s.available_slots} ${s.available_slots === 1 ? 'vaga' : 'vagas'}`
}

export const formatKm = (km: number) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace('.', ',')} km`

export const formatPrice = (perKwh: number) => `R$ ${perKwh.toFixed(2).replace('.', ',')}/kWh`

/** Google Maps directions deep link (same intent as the backend's /route endpoint). */
export const mapsDirectionsUrl = (s: Pick<ChargingStation, 'lat' | 'lng'>) =>
  `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}&travelmode=driving`
