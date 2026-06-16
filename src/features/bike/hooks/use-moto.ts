import { Linking } from 'react-native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { useDialog } from '@/providers/overlay/use-dialog'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { mapsDirectionsUrl, mapsViewUrl } from '../services/bike.dto'
import { BikeService } from '../services/bike.service'
import { useBikeQuery } from './use-bike-query'

/**
 * Moto controller. Real bike identity + battery (mock-server telemetry); a 404
 * resolves to no bike, surfacing the link CTA. "Ver no mapa" opens the location;
 * locate/lock/history await the telemetry integration.
 */
export function useMoto() {
  const nav = useNavigation()
  const toast = useToast()
  const dialog = useDialog()
  const qc = useQueryClient()
  const query = useBikeQuery()
  const moto = query.data ?? null

  const soon = () => toast.show({ message: 'Disponível em breve.', type: 'info' })

  const unlink = useMutation({
    mutationFn: async () => {
      const res = await BikeService.unlink()
      if (!res.success) throw res.error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.bike.all })
      toast.show({ message: 'Moto desvinculada.', type: 'success' })
    },
  })

  const onUnlink = async () => {
    const ok = await dialog.confirm({
      title: 'Desvincular moto?',
      message: 'Você poderá vincular novamente quando quiser.',
      confirmText: 'Desvincular',
      destructive: true,
    })
    if (ok) unlink.mutate()
  }

  const linkQr = useMutation({
    mutationFn: async (qrCode: string) => {
      const res = await BikeService.link({ qr_code: qrCode })
      if (!res.success) throw res.error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.bike.all })
      toast.show({ message: 'Moto vinculada!', type: 'success' })
    },
  })

  return {
    query,
    moto,
    onScanQr: (qrCode: string) => linkQr.mutate(qrCode),
    linkingQr: linkQr.isPending,
    onVincular: () => nav.push(nav.routes.private.linkBike()),
    onUnlink,
    onMap: () => {
      if (moto) Linking.openURL(mapsViewUrl(moto.location)).catch(soon)
    },
    onLocate: () => {
      if (moto) Linking.openURL(mapsDirectionsUrl(moto.location)).catch(soon)
    },
    onLock: soon,
    onHistory: soon,
  }
}
