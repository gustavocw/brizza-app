import * as Clipboard from 'expo-clipboard'
import { useToast } from '@/providers/toast/use-toast'
import { useUserLocation } from '@/shared/hooks/use-user-location'
import { useDashboardQuery } from './use-dashboard-query'

/**
 * Dashboard controller. Owns the (mocked) telemetry query and the copy-address
 * handler; the view renders what it returns. The location card shows the user's
 * registered address (TEMPORARY until the fleet API ships the real vehicle GPS);
 * while it resolves, the mocked snapshot location is the fallback. The moto
 * name/status header lives in the shared MotoHeader (present on every tab).
 */
export function useHome() {
  const toast = useToast()
  const query = useDashboardQuery()
  const { coords, address } = useUserLocation()

  const location =
    coords && address?.street && address.city
      ? {
          address: [address.street, address.number].filter(Boolean).join(', '),
          city: address.city,
          updatedAgo: 'agora',
          latitude: coords.latitude,
          longitude: coords.longitude,
        }
      : (query.data?.location ?? null)

  const onCopyAddress = async () => {
    if (!location) return
    try {
      await Clipboard.setStringAsync(`${location.address}, ${location.city}`)
      toast.show({ message: 'Endereço copiado.', type: 'success' })
    } catch {
      toast.show({ message: 'Não foi possível copiar o endereço.', type: 'error' })
    }
  }

  return {
    query,
    location,
    onCopyAddress,
  }
}
