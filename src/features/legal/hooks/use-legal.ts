import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { legalTitle, type LegalKind } from '../services/legal.dto'
import { LegalService } from '../services/legal.service'
import { useLegalQuery } from './use-legal-query'

/**
 * Legal viewer controller. Fetches the current document and, when the signed-in
 * user hasn't accepted the current version (GET /user/me/terms-status), exposes an
 * accept action (records both current versions via POST /user/me/accept-terms).
 */
export function useLegal() {
  const nav = useNavigation()
  const toast = useToast()
  const qc = useQueryClient()
  const { kind: raw } = useLocalSearchParams<{ kind: string }>()
  const kind: LegalKind = raw === 'terms' ? 'terms' : 'privacy'
  const query = useLegalQuery(kind)

  const status = useQuery({
    queryKey: qk.legal.status(),
    queryFn: async () => {
      const res = await LegalService.status()
      if (!res.success) throw res.error
      return res.data
    },
  })

  const accept = useMutation({
    mutationFn: async () => {
      const [terms, privacy] = await Promise.all([LegalService.current('terms'), LegalService.current('privacy')])
      if (!terms.success) throw terms.error
      if (!privacy.success) throw privacy.error
      const res = await LegalService.accept({
        terms_version: terms.data.version ?? '',
        privacy_version: privacy.data.version ?? '',
      })
      if (!res.success) throw res.error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.legal.status() })
      toast.show({ message: 'Termos aceitos.', type: 'success' })
    },
  })

  const acceptedVersion = kind === 'terms' ? status.data?.terms_version : status.data?.privacy_version
  const needsAccept =
    !!status.data && !!query.data && (!status.data.accepted || acceptedVersion !== query.data.version)

  return {
    kind,
    query,
    title: legalTitle(kind),
    onBack: nav.back,
    needsAccept,
    onAccept: () => accept.mutate(),
    accepting: accept.isPending,
  }
}
