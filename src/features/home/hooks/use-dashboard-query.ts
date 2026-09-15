import { useQuery } from '@tanstack/react-query'
import { getApiErrorCode } from '@/lib/api'
import { qk } from '@/lib/query-keys'
import { DashboardService } from '../services/dashboard.service'

// Telemetria muda sozinha e não há WebSocket: a tela busca de novo a cada 30 s.
// Conta sem moto (404 BIKE_NOT_LINKED) devolve null, que a tela trata como
// "vincule sua moto".
export function useDashboardQuery() {
  return useQuery({
    queryKey: qk.dashboard.summary('mine'),
    queryFn: async () => {
      const res = await DashboardService.summary()
      if (res.success) return res.data
      if (getApiErrorCode(res.error) === 'BIKE_NOT_LINKED') return null
      throw res.error
    },
    refetchInterval: 30_000,
  })
}
