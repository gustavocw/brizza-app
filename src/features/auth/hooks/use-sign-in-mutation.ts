import { useMutation } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/lib/api'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { AuthService } from '../services/auth.service'
import { toAppUser, type SignInForm } from '../services/auth.dto'

/**
 * Sign-in write. Unwraps the ApiResponse (throws on failure → global error toast),
 * persists the access + refresh tokens, fills the auth store and lands on the home tab.
 */
export function useSignInMutation() {
  const nav = useNavigation()
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: async ({ identifier, password }: SignInForm) => {
      const res = await AuthService.signIn({ identifier: identifier.trim(), password })
      if (!res.success) throw res.error
      return res.data
    },
    onSuccess: async ({ access_token, refresh_token, user }) => {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, access_token],
        [REFRESH_TOKEN_KEY, refresh_token],
      ])
      login(toAppUser(user))
      nav.replace(nav.routes.tabs.motorcycle())
    },
  })
}
