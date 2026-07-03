import { z } from 'zod'
import type { KeyboardTypeOptions } from 'react-native'
import { isValidPhone, maskPhone } from '@/shared/utils/masks'

export type ContactKind = 'email' | 'phone'

export const requestEmailSchema = z.object({
  value: z.string().trim().email('E-mail inválido').max(254, 'E-mail muito longo'),
  current_password: z.string().min(1, 'Informe sua senha atual'),
})
export const requestPhoneSchema = z.object({
  value: z.string().refine(isValidPhone, 'Telefone inválido'),
  current_password: z.string().min(1, 'Informe sua senha atual'),
})
export type RequestForm = { value: string; current_password: string }

export const confirmSchema = z.object({ code: z.string().regex(/^\d{6}$/, 'Código de 6 dígitos') })
export type ConfirmForm = z.infer<typeof confirmSchema>

export const CONTACT: Record<
  ContactKind,
  {
    title: string
    label: string
    placeholder: string
    keyboardType: KeyboardTypeOptions
    done: string
    mask?: (raw: string) => string
  }
> = {
  email: {
    title: 'Trocar e-mail',
    label: 'Novo e-mail',
    placeholder: 'novo@email.com',
    keyboardType: 'email-address',
    done: 'E-mail atualizado.',
  },
  phone: {
    title: 'Trocar telefone',
    label: 'Novo telefone',
    placeholder: '(31) 99999-9999',
    keyboardType: 'phone-pad',
    done: 'Telefone atualizado.',
    mask: maskPhone,
  },
}
