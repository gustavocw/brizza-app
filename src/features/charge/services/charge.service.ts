import { apiGet, type ApiResponse } from '@/lib/api'
import type { ChargingStation, LatLng } from './station.dto'

/** Device location fallback (Savassi, BH) until real GPS (expo-location) is wired. */
export const DEFAULT_LOCATION: LatLng = { latitude: -19.932, longitude: -43.9377 }

type NearbyParams = { lat: number; lng: number; radius_km?: number; limit?: number }

/**
 * Charging stations. Real call to `GET /charging-stations` (PostGIS radius). The
 * endpoint is a BUSINESS route, gated by verification + coverage deposit + current
 * terms — a 403 there means the account still needs onboarding. Returns the list
 * sorted by distance.
 */
export const ChargeService = {
  nearby: async (params: NearbyParams): Promise<ApiResponse<ChargingStation[]>> => {
    const res = await apiGet<NearbyParams, { stations: ChargingStation[] }>('/charging-stations', {
      lat: params.lat,
      lng: params.lng,
      radius_km: params.radius_km ?? 10,
      limit: params.limit ?? 30,
    })
    if (!res.success) return res
    const stations = [...(res.data.stations ?? [])].sort((a, b) => a.distance_km - b.distance_km)
    return { success: true, data: stations }
  },
}
