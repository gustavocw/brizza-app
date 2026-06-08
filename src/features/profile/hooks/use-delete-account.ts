import { useMutation, useQueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/lib/api'
import { useAuthStore } from '@/shared/stores/auth.store'
import { ProfileService } from '../services/profile.service'

/**
 * Delete account (Apple Guideline 5.1.1(v) / LGPD Art. 18 VI). DELETE /user/me
 * soft-deletes (purge after 30d) and requires the password to confirm intent.
 * A wrong password throws → the global error toast fires and the sheet stays open
 * for a retry. On success the local session is wiped here; the controller closes
 * the sheet and navigates (so the sheet never flickers over the login screen).
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient()
  const logout = useAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: async (password: string) => {
      const res = await ProfileService.deleteAccount(password)
      if (!res.success) throw res.error
    },
    onSuccess: async () => {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY])
      logout()
      queryClient.clear()
    },
  })
}
