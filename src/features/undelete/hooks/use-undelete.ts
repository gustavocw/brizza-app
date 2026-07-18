import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/lib/api'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { useAuthStore } from '@/shared/stores/auth.store'
import { toAppUser } from '@/features/auth/services/auth.dto'
import { AuthService } from '@/features/auth/services/auth.service'
import { undeleteSchema, type UndeleteForm } from '../services/undelete.dto'
import { UndeleteService } from '../services/undelete.service'

/**
 * Undelete controller. POST /auth/undelete returns 204 with no body, so after
 * reactivating we log in with the same credentials to get the session tokens.
 */
export function useUndelete() {
  const nav = useNavigation()
  const login = useAuthStore((s) => s.login)

  const { control, handleSubmit } = useForm<UndeleteForm>({
    resolver: zodResolver(undeleteSchema),
    defaultValues: { identifier: '', password: '' },
  })

  const mutation = useMutation({
    mutationFn: async (form: UndeleteForm) => {
      const identifier = form.identifier.trim()
      const res = await UndeleteService.undelete({ identifier, password: form.password })
      if (!res.success) throw res.error
      const signIn = await AuthService.signIn({ identifier, password: form.password })
      if (!signIn.success) throw signIn.error
      return signIn.data
    },
    onSuccess: async (data) => {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, data.access_token],
        [REFRESH_TOKEN_KEY, data.refresh_token],
      ])
      login(toAppUser(data.user))
      nav.replace(nav.routes.tabs.motorcycle())
    },
  })

  return { control, onSubmit: handleSubmit((v) => mutation.mutate(v)), isPending: mutation.isPending }
}
