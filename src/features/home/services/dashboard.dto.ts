import type { ImageSourcePropType } from 'react-native'
import type { BikeStatusKind } from '@/features/bike/services/bike.dto'

/**
 * Resumo do painel inicial, montado a partir de GET /user/me/bike (identidade) e
 * GET /user/me/bike/status (telemetria).
 *
 * Sem fonte no backend, comentados nas telas até existir dado real:
 * saúde da bateria e ciclos de carga (BMS), ficha técnica do modelo, temperatura
 * e estado do motor (controlador), distância da última viagem fechada, velocidade
 * média, CO₂ economizado, próxima revisão e as checagens de sistema/freio/pneu.
 */
export type DashboardData = {
  /** A API não guarda foto da moto: imagem padrão do app. */
  image: ImageSourcePropType
  status: BikeStatusKind
  lastSeen: string
  battery: { percent: number; autonomyKm: number }
  odometerKm: number
  tripKm: number
  speedKmh: number
  batteryVoltage: number
  rssi: number
  location: { address: string; city: string; updatedAgo: string; latitude: number; longitude: number } | null
}
