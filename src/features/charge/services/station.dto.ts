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
  // MOCK-ONLY presentation fields (not in the running API yet — the charging
  // network will ship them). Optional so the real payload keeps typechecking.
  photoUrl?: string
  rating?: number
  reviewCount?: number
  hours?: string
}

export type LatLng = { latitude: number; longitude: number }

/** available = open with free slots · busy = open but full · offline = closed. */
export function availabilityOf(s: ChargingStation): Availability {
  if (!s.is_open) return 'offline'
  return s.available_slots > 0 ? 'available' : 'busy'
}

/** Slot-aware status label: "4 vagas" / "Lotada" / "Fechada". */
export function availabilityLabel(s: ChargingStation): string {
  const a = availabilityOf(s)
  if (a === 'offline') return 'Fechada'
  if (a === 'busy') return 'Lotada'
  return `${s.available_slots} ${s.available_slots === 1 ? 'vaga' : 'vagas'}`
}

export const formatKm = (km: number) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace('.', ',')} km`

/** Just the money part ("R$ 1,90") — the unit renders separately in the UI. */
export const formatPriceShort = (perKwh: number) => `R$ ${perKwh.toFixed(2).replace('.', ',')}`

/** "4,9 (59 avaliações)" — pt-BR rating line under the station name. */
export const formatRating = (rating?: number, reviews?: number) =>
  rating == null
    ? null
    : `${rating.toFixed(1).replace('.', ',')}${reviews ? ` (${reviews} ${reviews === 1 ? 'avaliação' : 'avaliações'})` : ''}`

/** Google Maps directions deep link (same intent as the backend's /route endpoint). */
export const mapsDirectionsUrl = (s: Pick<ChargingStation, 'lat' | 'lng'>) =>
  `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}&travelmode=driving`

/** Decode Google's encoded polyline (Directions API) into map coordinates. */
export function decodePolyline(encoded: string): LatLng[] {
  const points: LatLng[] = []
  let index = 0
  let lat = 0
  let lng = 0
  while (index < encoded.length) {
    let b = 0
    let shift = 0
    let result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lat += result & 1 ? ~(result >> 1) : result >> 1
    shift = 0
    result = 0
    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    lng += result & 1 ? ~(result >> 1) : result >> 1
    points.push({ latitude: lat / 1e5, longitude: lng / 1e5 })
  }
  return points
}
