import type { ApiResponse } from '@/lib/api'
import type { ChargingStation, LatLng } from './station.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED charging stations around Belo Horizonte. The real inventory comes from
// the third-party network, which isn't wired to our backend yet. To go live, swap
// nearby() for GET /charging-stations; the hook, controller and view stay untouched.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Device location fallback (Savassi, BH) until real GPS is wired. */
export const DEFAULT_LOCATION: LatLng = { latitude: -19.932, longitude: -43.9377 }

type NearbyParams = { lat: number; lng: number; radius_km?: number; limit?: number }

const STATIONS: ChargingStation[] = [
  { id: '1', name: 'Brizze Hub Savassi', address: 'Av. do Contorno, 6480', lat: -19.9355, lng: -43.929, distance_km: 0.4, total_slots: 6, available_slots: 4, price_per_kwh: 1.9, is_open: true },
  { id: '2', name: 'Pátio Cristóvão Colombo', address: 'R. Cristóvão Colombo, 312', lat: -19.938, lng: -43.935, distance_km: 0.8, total_slots: 4, available_slots: 2, price_per_kwh: 2.1, is_open: true },
  { id: '3', name: 'Shopping Pátio Savassi', address: 'Av. do Contorno, 6061', lat: -19.9405, lng: -43.9388, distance_km: 1.2, total_slots: 8, available_slots: 0, price_per_kwh: 2.3, is_open: true },
  { id: '4', name: 'Praça da Liberdade', address: 'Praça da Liberdade, s/n', lat: -19.932, lng: -43.937, distance_km: 1.6, total_slots: 4, available_slots: 3, price_per_kwh: 1.75, is_open: true },
  { id: '5', name: 'Mercado Central', address: 'Av. Augusto de Lima, 744', lat: -19.921, lng: -43.941, distance_km: 2.3, total_slots: 6, available_slots: 0, price_per_kwh: 2.5, is_open: true },
  { id: '6', name: 'Estação Lourdes', address: 'R. da Bahia, 1200', lat: -19.929, lng: -43.945, distance_km: 2.8, total_slots: 4, available_slots: 0, price_per_kwh: 2.4, is_open: false },
  { id: '7', name: 'Parque Municipal', address: 'Av. Afonso Pena, 1377', lat: -19.922, lng: -43.927, distance_km: 3.1, total_slots: 6, available_slots: 5, price_per_kwh: 1.95, is_open: true },
  { id: '8', name: 'BH Shopping Belvedere', address: 'BR-356, 3049', lat: -19.97, lng: -43.956, distance_km: 5.4, total_slots: 10, available_slots: 6, price_per_kwh: 2.2, is_open: true },
]

export const ChargeService = {
  async nearby(_params: NearbyParams): Promise<ApiResponse<ChargingStation[]>> {
    await delay(500)
    return { success: true, data: [...STATIONS].sort((a, b) => a.distance_km - b.distance_km) }
  },
}
