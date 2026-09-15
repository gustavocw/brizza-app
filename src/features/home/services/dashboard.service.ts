import type { ApiResponse } from '@/lib/api'
import { BikeService } from '@/features/bike/services/bike.service'
import { relSeen } from '@/features/bike/services/bike.dto'
import type { DashboardData } from './dashboard.dto'

const DEFAULT_BIKE_IMAGE = require('../../../../assets/motos/1.jpeg')

/** Resumo do painel: identidade + telemetria da moto da conta. */
export const DashboardService = {
  async summary(): Promise<ApiResponse<DashboardData | null>> {
    const bike = await BikeService.get()
    if (!bike.success) return bike

    const status = await BikeService.status()
    if (!status.success) return status

    const s = status.data
    return {
      success: true,
      data: {
        image: DEFAULT_BIKE_IMAGE,
        status: s.status ?? bike.data.status,
        lastSeen: relSeen(s.last_seen_at),
        battery: { percent: s.battery_pct, autonomyKm: s.autonomy_km },
        odometerKm: s.odometer_km ?? 0,
        tripKm: s.trip_km ?? 0,
        speedKmh: s.speed_kmh ?? 0,
        batteryVoltage: s.battery_voltage ?? 0,
        rssi: s.rssi ?? 0,
        location: s.location
          ? {
              address: '',
              city: '',
              updatedAgo: relSeen(s.last_gps_at ?? s.last_seen_at),
              latitude: s.location.lat,
              longitude: s.location.lng,
            }
          : null,
      },
    }
  },
}
