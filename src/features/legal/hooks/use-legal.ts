import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { useMeQuery } from '@/features/profile/hooks/use-me-query'
import { legalTitle, type LegalKind } from '../services/legal.dto'
import { LegalService } from '../services/legal.service'
import { useLegalQuery } from './use-legal-query'

/**
 * Legal viewer controller. Fetches the current document and, when the signed-in
 * user hasn't accepted the current version, exposes an accept action (records both
 * current versions via POST /user/me/accept-terms).
 */
export function useLegal() {
  const nav = useNavigation()
  const toast = useToast()
  const qc = useQueryClient()
  const { kind: raw } = useLocalSearchParams<{ kind: string }>()
  const kind: LegalKind = raw === 'terms' ? 'terms' : 'privacy'
  const query = useLegalQuery(kind)
  const me = useMeQuery()

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
      qc.invalidateQueries({ queryKey: qk.me.profile() })
      toast.show({ message: 'Termos aceitos.', type: 'success' })
    },
  })

  const accepted = kind === 'terms' ? me.data?.terms_version_accepted : me.data?.privacy_version_accepted
  const needsAccept = !!me.data && !!query.data && accepted !== query.data.version

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
