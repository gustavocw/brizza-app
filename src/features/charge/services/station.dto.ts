// Contract for charging stations. Mirrors the Brizza API `ChargingStation` schema
// and `GET /charging-stations?lat&lng&radius_km` (apidocs/openapi.yaml). Data is
// mocked for now (see charge.service.ts) but typed to swap in the real call later.

export type Availability = 'available' | 'busy' | 'offline'

export type ChargingStation = {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  distance_km: number
  price_brl: number
  availability: Availability
}

export type LatLng = { latitude: number; longitude: number }

export const AVAILABILITY: Record<Availability, { label: string; dot: string; text: string }> = {
  available: { label: 'Disponível', dot: 'bg-success', text: 'text-success' },
  busy: { label: 'Ocupada', dot: 'bg-warning', text: 'text-warning' },
  offline: { label: 'Offline', dot: 'bg-subtle', text: 'text-subtle' },
}

export const formatKm = (km: number) =>
  km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1).replace('.', ',')} km`

export const formatPrice = (brl: number) => `R$ ${brl.toFixed(2).replace('.', ',')}/kWh`

/** Google Maps directions deep link (same intent as the backend's /route endpoint). */
export const mapsDirectionsUrl = (s: Pick<ChargingStation, 'lat' | 'lng'>) =>
  `https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}&travelmode=driving`
