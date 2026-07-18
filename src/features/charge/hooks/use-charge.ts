import { useState } from 'react'
import { useToast } from '@/providers/toast/use-toast'
import { useUserLocation } from '@/shared/hooks/use-user-location'
import { ChargeService, DEFAULT_LOCATION } from '../services/charge.service'
import type { ChargingStation, LatLng } from '../services/station.dto'
import { useStationsQuery } from './use-stations-query'

export type ChargeView = 'map' | 'list'

/**
 * Charge controller. Owns the nearby-stations query, the map/list view toggle,
 * the search filter, the selected station (bottom card over the map), favorites
 * and the route/charge actions. The view renders what it returns and owns the
 * map ref for recentering. The map centers on the user's registered address
 * (TEMPORARY until the fleet API ships real GPS).
 */
export function useCharge() {
  const toast = useToast()
  const { coords } = useUserLocation()
  const userLocation = coords ?? DEFAULT_LOCATION
  const query = useStationsQuery(userLocation)

  const [view, setView] = useState<ChargeView>('map')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [route, setRoute] = useState<LatLng[] | null>(null)
  const [routing, setRouting] = useState(false)

  const all = query.data ?? []
  const term = search.trim().toLowerCase()
  const stations = term
    ? all.filter((s) => `${s.name} ${s.address}`.toLowerCase().includes(term))
    : all
  const selectedStation = stations.find((s) => s.id === selectedId) ?? null

  const onSelectStation = (s: ChargingStation) => {
    setSelectedId(s.id)
    setRoute(null) // a new pick invalidates the previous route
  }
  const onCloseStation = () => {
    setSelectedId(null)
    setRoute(null)
  }

  const onToggleFavorite = (id: string) =>
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // In-app route: draws the driving polyline on OUR map — the user never leaves.
  const onRoute = async (station: ChargingStation) => {
    if (routing) return
    setRouting(true)
    const coords = await ChargeService.route(userLocation, station)
    setRouting(false)
    if (coords && coords.length > 1) setRoute(coords)
    else toast.show({ message: 'Não foi possível traçar a rota.', type: 'error' })
  }

  const onStartCharging = () => toast.show({ message: 'Disponível em breve.', type: 'info' })

  return {
    query,
    stations,
    userLocation,
    /** Raw device/geocoded coords — null until resolved (userLocation falls back meanwhile). */
    coords,
    view,
    setView,
    search,
    setSearch,
    selectedStation,
    onSelectStation,
    onCloseStation,
    favorites,
    onToggleFavorite,
    route,
    routing,
    onRoute,
    onStartCharging,
  }
}
