import { useMutation, useQueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/lib/api'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { AuthService } from '@/features/auth/services/auth.service'

/**
 * Sign out. Best-effort revokes the refresh token server-side (POST /auth/logout),
 * then ALWAYS tears down the local session — even offline — and lands on login.
 * Never surfaces an error: a failed revoke must not trap the user inside the app.
 */
export function useSignOut() {
  const nav = useNavigation()
  const queryClient = useQueryClient()
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: async () => {
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY)
      if (refreshToken) await AuthService.logout(refreshToken) // ApiResponse, never throws
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY])
    },
    onSuccess: () => {
      logout()
      queryClient.clear()
      nav.replace(nav.routes.public.signIn())
    },
  })
}
