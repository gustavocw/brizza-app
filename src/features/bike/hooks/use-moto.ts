import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { useDialog } from '@/providers/overlay/use-dialog'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { BikeService } from '../services/bike.service'
import { useBikeQuery } from './use-bike-query'

/**
 * Motor controller. Real bike identity + telemetry (mock-server); a 404 resolves
 * to no bike, surfacing the link CTA. The quick actions (locate/lock/history) and
 * location moved to the Home tab, so this only owns identity + link/unlink.
 */
export function useMoto() {
  const nav = useNavigation()
  const toast = useToast()
  const dialog = useDialog()
  const qc = useQueryClient()
  const query = useBikeQuery()
  const moto = query.data ?? null

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
  }
}
