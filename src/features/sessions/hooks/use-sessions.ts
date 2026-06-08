import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { useDialog } from '@/providers/overlay/use-dialog'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { SessionsService } from '../services/sessions.service'
import type { Session } from '../services/sessions.dto'

/**
 * Sessions controller. Lists active sessions and revokes one (optimistic removal,
 * behind a confirm). The current session has no revoke action.
 */
export function useSessions() {
  const nav = useNavigation()
  const dialog = useDialog()
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: qk.sessions.all,
    queryFn: async () => {
      const res = await SessionsService.list()
      if (!res.success) throw res.error
      return res.data.sessions
    },
  })

  const revoke = useMutation({
    mutationFn: async (id: string) => {
      const res = await SessionsService.revoke(id)
      if (!res.success) throw res.error
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: qk.sessions.all })
      const prev = qc.getQueryData<Session[]>(qk.sessions.all)
      qc.setQueryData<Session[]>(qk.sessions.all, (old) => old?.filter((s) => s.id !== id))
      return { prev }
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(qk.sessions.all, ctx.prev)
    },
  })

  const onRevoke = async (session: Session) => {
    const ok = await dialog.confirm({
      title: 'Encerrar sessão?',
      message: 'Este aparelho precisará entrar novamente.',
      confirmText: 'Encerrar',
      destructive: true,
    })
    if (ok) revoke.mutate(session.id)
  }

  return { query, sessions: query.data ?? [], onRevoke, onBack: nav.back }
}
