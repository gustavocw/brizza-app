import { Linking } from 'react-native'
import { useToast } from '@/providers/toast/use-toast'
import { DEFAULT_LOCATION } from '../services/charge.service'
import { mapsDirectionsUrl, type ChargingStation } from '../services/station.dto'
import { useStationsQuery } from './use-stations-query'

/**
 * Charge controller. Owns the (mocked) nearby-stations query and the "open route"
 * action; the view renders the map + list it returns and owns the map ref for
 * recentering. Stations come sorted by distance from the service.
 */
export function useCharge() {
  const toast = useToast()
  const query = useStationsQuery()
  const stations = query.data ?? []
  const availableCount = stations.filter((s) => s.availability === 'available').length

  const onRoute = (station: ChargingStation) => {
    Linking.openURL(mapsDirectionsUrl(station)).catch(() =>
      toast.show({ message: 'Não foi possível abrir o mapa.', type: 'error' }),
    )
  }

  return {
    query,
    stations,
    userLocation: DEFAULT_LOCATION,
    availableCount,
    onRoute,
  }
}
