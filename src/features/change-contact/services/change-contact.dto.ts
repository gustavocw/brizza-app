import { z } from 'zod'
import type { KeyboardTypeOptions } from 'react-native'

export type ContactKind = 'email' | 'phone'

export const requestEmailSchema = z.object({ value: z.string().trim().email('E-mail inválido') })
export const requestPhoneSchema = z.object({ value: z.string().trim().min(8, 'Telefone inválido') })
export type RequestForm = { value: string }

export const confirmSchema = z.object({ code: z.string().regex(/^\d{6}$/, 'Código de 6 dígitos') })
export type ConfirmForm = z.infer<typeof confirmSchema>

export const CONTACT: Record<
  ContactKind,
  { title: string; label: string; placeholder: string; keyboardType: KeyboardTypeOptions; done: string }
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
  },
}
