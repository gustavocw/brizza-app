import type { ApiResponse } from '@/lib/api'
import type { ChargingStation, LatLng } from './station.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED charging stations around Belo Horizonte. To go live, swap nearby() for
//   apiGet<{ lat; lng; radius_km }, { stations: ChargingStation[] }>(
//     '/charging-stations', { lat, lng, radius_km: 10 },
//   ) and return res.data.stations — the hook, controller and view stay untouched.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Device location (mocked): Savassi, Belo Horizonte. */
export const DEFAULT_LOCATION: LatLng = { latitude: -19.932, longitude: -43.9377 }

const STATIONS: ChargingStation[] = [
  { id: '1', name: 'Brizza Hub Savassi', address: 'Av. do Contorno, 6480', lat: -19.9355, lng: -43.929, distance_km: 0.4, price_brl: 1.9, availability: 'available' },
  { id: '2', name: 'Pátio Cristóvão Colombo', address: 'R. Cristóvão Colombo, 312', lat: -19.938, lng: -43.935, distance_km: 0.8, price_brl: 2.1, availability: 'available' },
  { id: '3', name: 'Shopping Pátio Savassi', address: 'Av. do Contorno, 6061', lat: -19.9405, lng: -43.9388, distance_km: 1.2, price_brl: 2.3, availability: 'busy' },
  { id: '4', name: 'Praça da Liberdade', address: 'Praça da Liberdade, s/n', lat: -19.932, lng: -43.937, distance_km: 1.6, price_brl: 1.75, availability: 'available' },
  { id: '5', name: 'Mercado Central', address: 'Av. Augusto de Lima, 744', lat: -19.921, lng: -43.941, distance_km: 2.3, price_brl: 2.5, availability: 'busy' },
  { id: '6', name: 'Estação Lourdes', address: 'R. da Bahia, 1200', lat: -19.929, lng: -43.945, distance_km: 2.8, price_brl: 2.4, availability: 'offline' },
  { id: '7', name: 'Parque Municipal', address: 'Av. Afonso Pena, 1377', lat: -19.922, lng: -43.927, distance_km: 3.1, price_brl: 1.95, availability: 'available' },
  { id: '8', name: 'BH Shopping Belvedere', address: 'BR-356, 3049', lat: -19.97, lng: -43.956, distance_km: 5.4, price_brl: 2.2, availability: 'available' },
]

export const ChargeService = {
  async nearby(): Promise<ApiResponse<ChargingStation[]>> {
    await delay(600)
    return { success: true, data: STATIONS }
  },
}
