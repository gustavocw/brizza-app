import { apiDelete, apiGet, apiPost, type ApiResponse } from '@/lib/api'
import { relSeen, type BikeStatusKind, type MotoData } from './bike.dto'

type BikeApi = { id: string; plate: string; qr_code?: string; model?: string; status?: string }
type StatusApi = {
  battery_pct?: number
  autonomy_km?: number
  status?: string
  last_seen_at?: string | null
  location?: { lat: number; lng: number } | null
}

const STATUS_KINDS: BikeStatusKind[] = ['pending_activation', 'active', 'offline', 'charging', 'disabled']

// Telemetry the API does not expose yet (the backend flags /bike/status as a
// hardware-pending MOCK and it only returns battery/autonomy/status/location).
// These richer fields stay app-side until the telemetria-integracao spec ships.
const EXTRAS = {
  health: { healthPct: 98, chargeCycles: 142 },
  telemetry: { odometerKm: 2235, lastRouteKm: 8.4, avgSpeedKmh: 32, motorTempC: 28, motorState: 'Tudo certo' },
  specs: { powerKw: 3, topSpeedKmh: 90, chargeTimeH: 4, weightKg: 78, rangeKm: 120 },
}

// Trust the API's status; fall back to offline for unknown/missing values.
const toKind = (s?: string | null): BikeStatusKind =>
  STATUS_KINDS.includes(s as BikeStatusKind) ? (s as BikeStatusKind) : 'offline'

/**
 * Bike. Real identity (GET /user/me/bike) merged with the live battery/status
 * (GET /user/me/bike/status). A 404 means no bike is linked → resolves to `null`
 * (not an error). link/unlink hit POST/DELETE /user/me/bike.
 */
export const BikeService = {
  async snapshot(): Promise<ApiResponse<MotoData | null>> {
    const bike = await apiGet<void, BikeApi>('/user/me/bike')
    if (!bike.success) {
      if (bike.error.response?.status === 404) return { success: true, data: null }
      return bike
    }
    const st = await apiGet<void, StatusApi>('/user/me/bike/status')
    const s = st.success ? st.data : null

    const moto: MotoData = {
      model: bike.data.model || 'Brizze S1',
      plate: bike.data.plate || '',
      status: toKind(s?.status ?? bike.data.status),
      lastSeen: relSeen(s?.last_seen_at),
      battery: {
        percent: s?.battery_pct ?? 0,
        autonomyKm: s?.autonomy_km ?? 0,
        ...EXTRAS.health,
      },
      telemetry: EXTRAS.telemetry,
      specs: EXTRAS.specs,
      location: {
        address: 'Localização atual',
        updatedAgo: relSeen(s?.last_seen_at),
        lat: s?.location?.lat ?? -19.932,
        lng: s?.location?.lng ?? -43.9377,
      },
    }
    return { success: true, data: moto }
  },

  link: (body: { plate?: string; qr_code?: string; model?: string }) =>
    apiPost<typeof body, BikeApi>('/user/me/bike', body),
  unlink: () => apiDelete<void, void>('/user/me/bike'),
}
