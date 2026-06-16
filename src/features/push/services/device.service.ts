import { apiDelete, apiGet, apiPost } from '@/lib/api'
import type { Device, RegisterDeviceForm } from './device.dto'

/**
 * Push devices (FCM).
 *   POST   /user/me/devices       → register/refresh this device's token
 *   GET    /user/me/devices       → { devices }
 *   DELETE /user/me/devices/{id}  → revoke a device
 */
export const DeviceService = {
  register: (body: RegisterDeviceForm) => apiPost<RegisterDeviceForm, Device>('/user/me/devices', body),
  list: () => apiGet<void, { devices: Device[] }>('/user/me/devices'),
  remove: (id: string) => apiDelete<void, void>(`/user/me/devices/${id}`),
}
