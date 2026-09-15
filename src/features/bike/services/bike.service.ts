import { apiDelete, apiGet, apiPost } from '@/lib/api'
import type { Bike, BikeStatus } from './bike.dto'

export type LinkBikeBody = { plate?: string; qr_code?: string; model?: string }

/**
 * Moto do usuário. Uma conta tem no máximo uma moto: `get()` responde 404
 * BIKE_NOT_LINKED quando ainda não há vínculo, e os hooks tratam isso como
 * "sem moto", não como erro.
 */
export const BikeService = {
  get: () => apiGet<void, Bike>('/user/me/bike'),
  status: () => apiGet<void, BikeStatus>('/user/me/bike/status'),
  link: (body: LinkBikeBody) => apiPost<LinkBikeBody, Bike>('/user/me/bike', body),
  unlink: () => apiDelete<void, void>('/user/me/bike'),
}
