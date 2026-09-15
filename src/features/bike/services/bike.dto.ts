// Contrato da moto: `Bike` (identidade, GET /user/me/bike) e `BikeStatus`
// (telemetria, GET /user/me/bike/status). MotoData é a junção dos dois, que é
// o que as telas consomem.

import type { ImageSourcePropType } from 'react-native'

export type BikeStatusKind = 'pending_activation' | 'active' | 'offline' | 'charging' | 'disabled'

/** GET /user/me/bike */
export type Bike = {
  id: string
  plate: string | null
  qr_code: string | null
  model: string | null
  status: BikeStatusKind
  linked_at: string
  created_at?: string
  updated_at?: string
}

/** GET /user/me/bike/status — campos do rastreador vêm zerados no modo mock. */
export type BikeStatus = {
  battery_pct: number
  autonomy_km: number
  status: BikeStatusKind
  last_seen_at: string | null
  location: { lat: number; lng: number } | null
  speed_kmh?: number
  odometer_km?: number
  trip_km?: number
  battery_voltage?: number
  rssi?: number
  locked?: boolean
  gps_valid?: boolean
  last_gps_at?: string | null
}

export type MotoData = {
  id: string
  model: string
  plate: string
  /** A API não guarda foto da moto: imagem padrão do app. */
  image: ImageSourcePropType
  status: BikeStatusKind
  lastSeen: string
  battery: { percent: number; autonomyKm: number }
  telemetry: { odometerKm: number; tripKm: number; speedKmh: number; batteryVoltage: number; rssi: number }
  location: { address: string; updatedAgo: string; lat: number; lng: number } | null
  // Sem fonte no backend até o BMS/controlador entrarem na telemetria:
  // battery.healthPct, battery.chargeCycles, telemetry.motorTempC, telemetry.motorState,
  // telemetry.lastRouteKm, telemetry.avgSpeedKmh e specs (potência, velocidade máxima,
  // tempo de carga, peso, autonomia nominal).
}

const DEFAULT_BIKE_IMAGE = require('../../../../assets/motos/1.jpeg')

/** Junta identidade + telemetria no formato que as telas usam. */
export function toMotoData(bike: Bike, status?: BikeStatus | null): MotoData {
  const location = status?.location
  return {
    id: bike.id,
    model: bike.model || 'Minha moto',
    plate: bike.plate || bike.qr_code || '',
    image: DEFAULT_BIKE_IMAGE,
    status: status?.status ?? bike.status,
    lastSeen: relSeen(status?.last_seen_at),
    battery: { percent: status?.battery_pct ?? 0, autonomyKm: status?.autonomy_km ?? 0 },
    telemetry: {
      odometerKm: status?.odometer_km ?? 0,
      tripKm: status?.trip_km ?? 0,
      speedKmh: status?.speed_kmh ?? 0,
      batteryVoltage: status?.battery_voltage ?? 0,
      rssi: status?.rssi ?? 0,
    },
    location: location
      ? { address: '', updatedAgo: relSeen(status?.last_gps_at ?? status?.last_seen_at), lat: location.lat, lng: location.lng }
      : null,
  }
}

export const STATUS: Record<BikeStatusKind, { label: string; dot: string }> = {
  active: { label: 'Conectada', dot: 'bg-accent' },
  charging: { label: 'Carregando', dot: 'bg-warning' },
  offline: { label: 'Offline', dot: 'bg-subtle' },
  pending_activation: { label: 'Ativando', dot: 'bg-warning' },
  disabled: { label: 'Desativada', dot: 'bg-error' },
}

export const numberToBR = (n: number) => n.toLocaleString('pt-BR')

/** "agora" / "há 5 min" / "há 2 h" a partir de um ISO. */
export function relSeen(iso?: string | null): string {
  if (!iso) return 'agora'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return 'agora'
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (s < 60) return 'agora'
  const m = Math.floor(s / 60)
  if (m < 60) return `há ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `há ${h} h`
  return `há ${Math.floor(h / 24)} d`
}

/** Link do Google Maps mostrando onde a moto está. */
export const mapsViewUrl = (loc: { lat: number; lng: number }) =>
  `https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`

/** Rota até a moto, saindo da posição atual do celular. */
export const mapsDirectionsUrl = (loc: { lat: number; lng: number }) =>
  `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`
