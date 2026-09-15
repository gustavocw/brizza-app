import { useQuery } from '@tanstack/react-query'
import { getApiErrorCode } from '@/lib/api'
import { qk } from '@/lib/query-keys'
import { BikeService } from '../services/bike.service'
import { toMotoData, type Bike, type BikeStatus, type MotoData } from '../services/bike.dto'

// Conta sem moto é estado normal, não erro: a API responde 404 BIKE_NOT_LINKED
// e aqui isso vira `null`.
async function fetchBike(): Promise<Bike | null> {
  const res = await BikeService.get()
  if (res.success) return res.data
  if (getApiErrorCode(res.error) === 'BIKE_NOT_LINKED') return null
  throw res.error
}

async function fetchStatus(): Promise<BikeStatus | null> {
  const res = await BikeService.status()
  if (res.success) return res.data
  if (getApiErrorCode(res.error) === 'BIKE_NOT_LINKED') return null
  throw res.error
}

export function useBikeQuery() {
  return useQuery({ queryKey: qk.bike.mine(), queryFn: fetchBike })
}

// Telemetria muda sozinha: sem WebSocket, a tela busca de novo a cada 30 s.
export function useBikeStatusQuery(enabled: boolean) {
  return useQuery({
    queryKey: qk.bike.status(),
    queryFn: fetchStatus,
    enabled,
    refetchInterval: 30_000,
  })
}

/** Moto da conta já com a telemetria aplicada, ou null quando não há vínculo. */
export function useBike(): {
  bike: MotoData | null
  isLoading: boolean
  isError: boolean
  refetch: () => void
} {
  const bikeQuery = useBikeQuery()
  const statusQuery = useBikeStatusQuery(Boolean(bikeQuery.data))

  return {
    bike: bikeQuery.data ? toMotoData(bikeQuery.data, statusQuery.data) : null,
    isLoading: bikeQuery.isLoading,
    isError: bikeQuery.isError,
    refetch: () => {
      void bikeQuery.refetch()
      void statusQuery.refetch()
    },
  }
}
