import type { ApiResponse } from '@/lib/api'
import { ENV } from '@/shared/constants/env'
import { decodePolyline, type ChargingStation, type LatLng } from './station.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED charging stations. The real inventory comes from the third-party
// network, which isn't wired to our backend yet. Stations are placed at fixed
// OFFSETS AROUND the queried location, so wherever the demo runs the map and the
// distances stay coherent. To go live, swap nearby() for GET /charging-stations;
// the hook, controller and view stay untouched.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Device location fallback (Savassi, BH) until real GPS is wired. */
export const DEFAULT_LOCATION: LatLng = { latitude: -19.932, longitude: -43.9377 }

type NearbyParams = { lat: number; lng: number; radius_km?: number; limit?: number }

// Station photos are mock-only (Unsplash CDN). The card falls back to an icon tile
// while they load / if they fail, so no broken-image state ever shows.
const PHOTOS = [
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=60',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60',
  'https://images.unsplash.com/photo-1615829386703-e2bb66a7cb7d?w=400&q=60',
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&q=60',
]

/** Offsets in km (east/north) from the queried point — hypot(east, north) = distance. */
type Seed = Omit<ChargingStation, 'lat' | 'lng' | 'distance_km'> & { east: number; north: number }

const SEEDS: Seed[] = [
  { id: '1', name: 'Brizze Hub Savassi', address: 'Av. do Contorno, 6480', east: 0.28, north: 0.28, total_slots: 6, available_slots: 4, price_per_kwh: 1.9, is_open: true, photoUrl: PHOTOS[0], rating: 4.9, reviewCount: 59, hours: '24h' },
  { id: '2', name: 'Pátio Cristóvão Colombo', address: 'R. Cristóvão Colombo, 312', east: 0.75, north: -0.28, total_slots: 4, available_slots: 2, price_per_kwh: 2.1, is_open: true, photoUrl: PHOTOS[1], rating: 4.5, reviewCount: 42, hours: '24h' },
  { id: '3', name: 'Shopping Pátio Savassi', address: 'Av. do Contorno, 6061', east: -0.85, north: -0.85, total_slots: 8, available_slots: 0, price_per_kwh: 2.3, is_open: true, photoUrl: PHOTOS[2], rating: 4.7, reviewCount: 36, hours: '10h–22h' },
  { id: '4', name: 'Praça da Liberdade', address: 'Praça da Liberdade, s/n', east: -1.13, north: 1.13, total_slots: 4, available_slots: 3, price_per_kwh: 1.75, is_open: true, photoUrl: PHOTOS[3], rating: 4.8, reviewCount: 47, hours: '24h' },
  { id: '5', name: 'Mercado Central', address: 'Av. Augusto de Lima, 744', east: 0.6, north: 2.22, total_slots: 6, available_slots: 0, price_per_kwh: 2.5, is_open: true, photoUrl: PHOTOS[0], rating: 4.2, reviewCount: 28, hours: '8h–18h' },
  { id: '6', name: 'Estação Lourdes', address: 'R. da Bahia, 1200', east: -2.6, north: 1.04, total_slots: 4, available_slots: 0, price_per_kwh: 2.4, is_open: false, photoUrl: PHOTOS[1], rating: 4.0, reviewCount: 19, hours: '8h–20h' },
  { id: '7', name: 'Parque Municipal', address: 'Av. Afonso Pena, 1377', east: 2.2, north: 2.18, total_slots: 6, available_slots: 5, price_per_kwh: 1.95, is_open: true, photoUrl: PHOTOS[2], rating: 4.6, reviewCount: 33, hours: '24h' },
  { id: '8', name: 'BH Shopping Belvedere', address: 'BR-356, 3049', east: -3.8, north: -3.84, total_slots: 10, available_slots: 6, price_per_kwh: 2.2, is_open: true, photoUrl: PHOTOS[3], rating: 4.4, reviewCount: 51, hours: '10h–22h' },
]

const KM_PER_DEG_LAT = 111.32

function place(seed: Seed, origin: NearbyParams): ChargingStation {
  const { east, north, ...station } = seed
  return {
    ...station,
    lat: origin.lat + north / KM_PER_DEG_LAT,
    lng: origin.lng + east / (KM_PER_DEG_LAT * Math.cos((origin.lat * Math.PI) / 180)),
    distance_km: Math.round(Math.hypot(east, north) * 10) / 10,
  }
}

export const ChargeService = {
  async nearby(params: NearbyParams): Promise<ApiResponse<ChargingStation[]>> {
    await delay(500)
    const stations = SEEDS.map((s) => place(s, params)).sort((a, b) => a.distance_km - b.distance_km)
    return { success: true, data: stations }
  },

  /**
   * Driving route from the user to the station, decoded to map coordinates — drawn
   * in-app, the user never leaves. Uses the NEW Routes API (routes.googleapis.com),
   * NOT the legacy Directions web service: the legacy one ignores the key's
   * iOS/Android app restriction and always 403s, while Routes honors the bundle id
   * so a restricted (secure) key works from the real app. External Google call, so
   * it returns null on any failure instead of ApiResponse. Requires billing + the
   * Routes API enabled on the Maps key.
   */
  async route(origin: LatLng, dest: Pick<ChargingStation, 'lat' | 'lng'>): Promise<LatLng[] | null> {
    try {
      const res = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': ENV.googleMapsApiKey,
          'X-Goog-FieldMask': 'routes.polyline.encodedPolyline',
        },
        body: JSON.stringify({
          origin: { location: { latLng: { latitude: origin.latitude, longitude: origin.longitude } } },
          destination: { location: { latLng: { latitude: dest.lat, longitude: dest.lng } } },
          travelMode: 'DRIVE',
        }),
      })
      const json = await res.json()
      const points: string | undefined = json?.routes?.[0]?.polyline?.encodedPolyline
      return points ? decodePolyline(points) : null
    } catch {
      return null
    }
  },
}
