import { apiGet, type ApiResponse } from '@/lib/api'
import { ENV } from '@/shared/constants/env'
import { decodePolyline, type ChargingStation, type LatLng } from './station.dto'

/** Posição usada enquanto o GPS do aparelho não responde (Savassi, BH). */
export const DEFAULT_LOCATION: LatLng = { latitude: -19.932, longitude: -43.9377 }

type NearbyParams = { lat: number; lng: number; radius_km?: number }

export const ChargeService = {
  /** Estações cadastradas no backend, ordenadas por distância (PostGIS). */
  async nearby(params: NearbyParams): Promise<ApiResponse<ChargingStation[]>> {
    const res = await apiGet<NearbyParams, { stations: ChargingStation[] }>('/charging-stations', params)
    return res.success ? { success: true, data: res.data.stations ?? [] } : res
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
