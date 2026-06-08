import { Linking } from 'react-native'
import { useToast } from '@/providers/toast/use-toast'
import { mapsViewUrl } from '../services/bike.dto'
import { useBikeQuery } from './use-bike-query'

/**
 * Moto controller. Owns the (mocked) bike snapshot and the action handlers; the
 * view renders what it returns. "Ver no mapa" opens the bike's location in Google
 * Maps; locate/lock/history are placeholders until the telemetry integration.
 */
export function useMoto() {
  const toast = useToast()
  const query = useBikeQuery()
  const moto = query.data
  const soon = () => toast.show({ message: 'Disponível em breve.', type: 'info' })

  return {
    query,
    moto,
    onMap: () => {
      if (moto) Linking.openURL(mapsViewUrl(moto.location)).catch(soon)
    },
    onLocate: soon,
    onLock: soon,
    onHistory: soon,
  }
}
