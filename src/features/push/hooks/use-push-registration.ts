import { useEffect, useRef } from 'react'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useAuthStore } from '@/shared/stores/auth.store'
import { currentPlatform } from '../services/device.dto'
import { DeviceService } from '../services/device.service'

/**
 * Registers this device's push token with the API once per authenticated session.
 * Asks for the notifications permission, reads the native push token (FCM on
 * Android / APNs on iOS) and POSTs it to /user/me/devices. No-op on simulators or
 * when permission is denied. Actual delivery still needs Firebase credentials on
 * the build (google-services.json on Android, APNs key + Firebase on iOS).
 */
export function usePushRegistration() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const registered = useRef(false)

  useEffect(() => {
    if (!isAuthenticated || registered.current) return
    registered.current = true

    const run = async () => {
      if (!Device.isDevice) return // tokens are unavailable on simulators/emulators

      const current = await Notifications.getPermissionsAsync()
      let granted = current.granted
      if (!granted && current.canAskAgain) {
        granted = (await Notifications.requestPermissionsAsync()).granted
      }
      if (!granted) return

      const token = await Notifications.getDevicePushTokenAsync()
      if (!token?.data) return

      const res = await DeviceService.register({
        fcm_token: String(token.data),
        platform: currentPlatform(),
        device_name: Device.deviceName ?? Device.modelName ?? undefined,
      })
      if (!res.success) throw res.error
    }

    run().catch(() => {
      registered.current = false // transient failure → retry on next mount
    })
  }, [isAuthenticated])
}
