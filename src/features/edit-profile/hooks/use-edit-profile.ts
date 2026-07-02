import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { qk } from '@/lib/query-keys'
import { useToast } from '@/providers/toast/use-toast'
import { useNavigation } from '@/shared/hooks/use-navigation'
import { useMeQuery } from '@/features/profile/hooks/use-me-query'
import { onlyDigits } from '@/shared/utils/masks'
import { editProfileSchema, type EditProfileForm } from '../services/edit-profile.dto'
import { EditProfileService } from '../services/edit-profile.service'

const EMPTY: EditProfileForm = {
  first_name: '',
  last_name: '',
  zip: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}

/**
 * Edit-profile controller. Loads /user/me, prefills the form, autofills the
 * address from the CEP on blur, and PUTs the update (invalidating the me query).
 */
export function useEditProfile() {
  const nav = useNavigation()
  const toast = useToast()
  const qc = useQueryClient()
  const query = useMeQuery()
  const me = query.data

  const { control, handleSubmit, reset, setValue, getValues } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (!me) return
    reset({
      first_name: me.first_name,
      last_name: me.last_name,
      zip: me.address?.zip ?? '',
      street: me.address?.street ?? '',
      number: me.address?.number ?? '',
      complement: me.address?.complement ?? '',
      neighborhood: me.address?.neighborhood ?? '',
      city: me.address?.city ?? '',
      state: me.address?.state ?? '',
    })
  }, [me, reset])

  const onCepBlur = async () => {
    const zip = onlyDigits(getValues('zip'))
    if (zip.length !== 8) return
    const res = await EditProfileService.lookupCep(zip)
    if (!res.success) {
      toast.show({ message: 'CEP não encontrado. Preencha o endereço manualmente.', type: 'info' })
      return
    }
    const { street, neighborhood, city, state } = res.data
    if (street) setValue('street', street)
    if (neighborhood) setValue('neighborhood', neighborhood)
    if (city) setValue('city', city)
    if (state) setValue('state', state)
  }

  const mutation = useMutation({
    mutationFn: async (form: EditProfileForm) => {
      const res = await EditProfileService.update({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        address: {
          zip: onlyDigits(form.zip),
          street: form.street.trim(),
          number: form.number.trim(),
          complement: form.complement?.trim() || undefined,
          neighborhood: form.neighborhood.trim(),
          city: form.city.trim(),
          state: form.state.trim().toUpperCase(),
        },
      })
      if (!res.success) throw res.error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.me.profile() })
      toast.show({ message: 'Perfil atualizado.', type: 'success' })
      nav.back()
    },
  })

  return {
    control,
    query,
    onCepBlur,
    onSubmit: handleSubmit((v) => mutation.mutate(v)),
    isPending: mutation.isPending,
  }
}
