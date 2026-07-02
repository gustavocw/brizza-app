import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/lib/api'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { useAuthStore } from '@/shared/stores/auth.store'
import { changePasswordSchema, type ChangePasswordForm } from '../services/change-password.dto'
import { ChangePasswordService } from '../services/change-password.service'

/**
 * Change-password controller. On success the API revokes ALL refresh tokens, so we
 * wipe the session and send the user back to login to re-authenticate.
 */
export function useChangePassword() {
  const nav = useNavigation()
  const toast = useToast()
  const qc = useQueryClient()
  const logout = useAuthStore((s) => s.logout)

  const { control, handleSubmit } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { current_password: '', new_password: '', confirm: '' },
  })

  const mutation = useMutation({
    mutationFn: async (form: ChangePasswordForm) => {
      const res = await ChangePasswordService.update({
        current_password: form.current_password,
        new_password: form.new_password,
        new_password_confirm: form.confirm,
      })
      if (!res.success) throw res.error
    },
    onSuccess: async () => {
      await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY])
      logout()
      qc.clear()
      toast.show({ message: 'Senha alterada. Entre novamente.', type: 'success' })
      nav.replace(nav.routes.public.signIn())
    },
  })

  return {
    control,
    onSubmit: handleSubmit((v) => mutation.mutate(v)),
    isPending: mutation.isPending,
    onBack: nav.back,
  }
}
