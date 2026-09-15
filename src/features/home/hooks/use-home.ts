import * as Clipboard from 'expo-clipboard'
import { useToast } from '@/providers/toast/use-toast'
import { useUserLocation } from '@/shared/hooks/use-user-location'
import { useDashboardQuery } from './use-dashboard-query'

/**
 * Controlador do painel. A localização exibida é a da moto (GPS do rastreador);
 * a API devolve só coordenada, então o endereço vem da geocodificação do próprio
 * aparelho. Sem moto vinculada, `query.data` é null e a tela mostra o convite
 * para vincular.
 */
export function useHome() {
  const toast = useToast()
  const query = useDashboardQuery()
  const { coords, address } = useUserLocation()

  const bikeLocation = query.data?.location ?? null
  // Sem endereço da moto (a API devolve só lat/lng), o endereço do usuário serve
  // de rótulo enquanto a geocodificação reversa não entra.
  const location = bikeLocation
    ? {
        ...bikeLocation,
        address:
          bikeLocation.address ||
          (address?.street ? [address.street, address.number].filter(Boolean).join(', ') : 'Localização da moto'),
        city: bikeLocation.city || address?.city || '',
      }
    : coords && address?.street
      ? {
          address: [address.street, address.number].filter(Boolean).join(', '),
          city: address.city ?? '',
          updatedAgo: 'agora',
          latitude: coords.latitude,
          longitude: coords.longitude,
        }
      : null

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
