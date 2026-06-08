import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { REFRESH_TOKEN_KEY, TOKEN_KEY } from '@/lib/api'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { useAuthStore } from '@/shared/stores/auth.store'
import { toAppUser } from '@/features/auth/services/auth.dto'
import { registerSchema, type RegisterForm } from '../services/register.dto'
import { RegisterService } from '../services/register.service'

const EMPTY: RegisterForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  cpf: '',
  password: '',
  password_confirm: '',
  zip: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}

/**
 * Register controller. CEP autofills the address; on success, persists the tokens
 * and lands on the home tab (same as login).
 */
export function useRegister() {
  const nav = useNavigation()
  const login = useAuthStore((s) => s.login)

  const { control, handleSubmit, setValue, getValues } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: EMPTY,
  })

  const onCepBlur = async () => {
    const zip = getValues('zip').replace(/\D/g, '')
    if (zip.length !== 8) return
    const res = await RegisterService.lookupCep(zip)
    if (!res.success) return
    const { street, neighborhood, city, state } = res.data
    if (street) setValue('street', street)
    if (neighborhood) setValue('neighborhood', neighborhood)
    if (city) setValue('city', city)
    if (state) setValue('state', state)
  }

  const mutation = useMutation({
    mutationFn: async (form: RegisterForm) => {
      const res = await RegisterService.register({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.replace(/\D/g, ''),
        cpf: form.cpf.replace(/\D/g, ''),
        password: form.password,
        password_confirm: form.password_confirm,
        address: {
          zip: form.zip,
          street: form.street.trim(),
          number: form.number.trim(),
          complement: form.complement?.trim() || undefined,
          neighborhood: form.neighborhood.trim(),
          city: form.city.trim(),
          state: form.state.trim().toUpperCase(),
        },
      })
      if (!res.success) throw res.error
      return res.data
    },
    onSuccess: async (data) => {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, data.access_token],
        [REFRESH_TOKEN_KEY, data.refresh_token],
      ])
      login(toAppUser(data.user))
      nav.replace(nav.routes.tabs.home())
    },
  })

  return { control, onCepBlur, onSubmit: handleSubmit((v) => mutation.mutate(v)), isPending: mutation.isPending }
}
