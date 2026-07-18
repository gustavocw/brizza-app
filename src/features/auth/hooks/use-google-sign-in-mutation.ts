import { useMutation } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getApiErrorCode, REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/lib/api'
import { useAuthStore } from '@/shared/stores/auth.store'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { useToast } from '@/providers/toast/use-toast'
import { AuthService } from '../services/auth.service'
import { toAppUser } from '../services/auth.dto'
import { googleSignInIdToken } from '../services/google-auth'

/**
 * Google login write. Runs the native sign-in, sends the idToken to /auth/google,
 * then persists tokens and lands on home — same shape as e-mail/senha login. The
 * backend is login-only: an unknown e-mail comes back 401 (no Brizze account).
 */
export function useGoogleSignInMutation() {
  const nav = useNavigation()
  const login = useAuthStore((s) => s.login)
  const toast = useToast()

  return useMutation({
    mutationFn: async () => {
      const idToken = await googleSignInIdToken()
      if (!idToken) return null // cancelled
      const res = await AuthService.googleSignIn(idToken)
      if (!res.success) throw res.error
      return res.data
    },
    onSuccess: async (data) => {
      if (!data) return
      await AsyncStorage.multiSet([
        [TOKEN_KEY, data.access_token],
        [REFRESH_TOKEN_KEY, data.refresh_token],
      ])
      login(toAppUser(data.user))
      nav.replace(nav.routes.tabs.motorcycle())
    },
    onError: (err) => {
      const ax = err as AxiosError
      const status = ax?.response?.status
      const code = getApiErrorCode(err)
      let message: string
      if (code === 'INVALID_CREDENTIALS') message = 'Nenhuma conta Brizze com esse e-mail. Crie a conta primeiro.'
      else if (code === 'GOOGLE_EMAIL_UNVERIFIED') message = 'Seu e-mail do Google não está verificado.'
      else if (code === 'GOOGLE_TOKEN_INVALID') message = 'Não foi possível validar o login Google. Tente de novo.'
      else if (status === 404) message = 'Login com Google ainda não está ativo no servidor.'
      else if (err instanceof Error && !ax?.isAxiosError) message = err.message
      else message = 'Não foi possível entrar com o Google.'
      toast.show({ message, type: 'error' })
    },
  })
}
