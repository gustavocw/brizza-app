import { useMutation } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TOKEN_KEY } from '@/lib/api'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { AuthService } from '../services/auth.service'
import type { SignInVars } from '../services/auth.dto'

/**
 * Sign-in write. Unwraps the ApiResponse (throws on failure → global error toast)
 * then persists the token, fills the auth store and lands on the dashboard.
 */
export function useSignInMutation() {
  const nav = useNavigation()
  const login = useAuthStore((s) => s.login)

  return useMutation({
    mutationFn: async (vars: SignInVars) => {
      const res = await AuthService.signIn(vars)
      if (!res.success) throw res.error
      return res.data
    },
    onSuccess: async ({ token, user }) => {
      await AsyncStorage.setItem(TOKEN_KEY, token)
      login(user)
      nav.replace(nav.routes.tabs.home())
    },
  })
}
