import { useMutation, useQueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/lib/api'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { AuthService } from '@/features/auth/services/auth.service'

/**
 * Sign out. Fires a best-effort refresh-token revoke server-side (POST /auth/logout)
 * WITHOUT awaiting it, then ALWAYS tears down the local session — even offline or with
 * the API down — and lands on login. The server call must never block or trap the user.
 */
export function useSignOut() {
  const nav = useNavigation()
  const queryClient = useQueryClient()
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
      // Fire-and-forget: don't await the network so logout is instant even if the
      // backend is unreachable. AuthService.logout returns ApiResponse (never throws).
      if (refreshToken) void AuthService.logout(refreshToken)
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY])
    },
    onSuccess: () => {
      logout()
      queryClient.clear()
      nav.replace(nav.routes.public.signIn())
    },
  })
}
