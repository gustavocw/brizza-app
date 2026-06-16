import { Platform } from 'react-native'

export type DevicePlatform = 'ios' | 'android' | 'web'

export type Device = {
  id: string
  platform: DevicePlatform
  device_name?: string | null
  last_seen_at: string
  created_at: string
}

export type RegisterDeviceForm = {
  fcm_token: string
  platform: DevicePlatform
  device_name?: string
}

/** Maps the RN platform to the API's device platform enum. */
export const currentPlatform = (): DevicePlatform =>
  Platform.OS === 'android' ? 'android' : Platform.OS === 'web' ? 'web' : 'ios'
