import * as Clipboard from 'expo-clipboard'
import { useToast } from '@/providers/toast/use-toast'
import { useBottomSheet } from '@/providers/overlay/use-bottom-sheet'
import { useUserLocation } from '@/shared/hooks/use-user-location'
import { BikeSwitcherSheet } from '../components/bike-switcher-sheet'
import { useDashboardQuery } from './use-dashboard-query'

/**
 * Dashboard controller. Owns the (mocked) telemetry query and the header/location
 * handlers; the view renders what it returns. The location card shows the user's
 * registered address (TEMPORARY until the fleet API ships the real vehicle GPS);
 * while it resolves, the mocked snapshot location is the fallback. Tapping the
 * header opens the bike switcher (a blurred bottom sheet).
 */
export function useHome() {
  const toast = useToast()
  const sheet = useBottomSheet()
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

  const onSelectBike = () => {
    const vehicle = query.data?.vehicle
    if (!vehicle) return
    sheet.open({ snapToContent: true, children: <BikeSwitcherSheet model={vehicle.model} plate={vehicle.plate} /> })
  }

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
    onSelectBike,
    onCopyAddress,
  }
}
