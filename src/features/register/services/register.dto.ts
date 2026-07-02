import { z } from 'zod'
import { isValidCpf, isValidPhone, isValidCep } from '@/shared/utils/masks'

// Mirrors RegisterRequest. Address is flattened in the form and rebuilt on submit.
// Masked fields (phone/cpf/zip) validate on their digits — the mask is stripped
// before the payload is sent (see use-register.ts).
export const registerSchema = z
  .object({
    first_name: z.string().trim().min(2, 'Mínimo de 2 caracteres'),
    last_name: z.string().trim().min(2, 'Mínimo de 2 caracteres'),
    email: z.string().trim().email('E-mail inválido'),
    phone: z.string().refine(isValidPhone, 'Telefone inválido'),
    cpf: z.string().refine(isValidCpf, 'CPF inválido'),
    password: z.string().min(8, 'Mínimo de 8 caracteres'),
    password_confirm: z.string().min(1, 'Confirme a senha'),
    zip: z.string().refine(isValidCep, 'CEP de 8 dígitos'),
    street: z.string().trim().min(1, 'Informe a rua'),
    number: z.string().trim().min(1, 'Informe o número'),
    complement: z.string().trim().optional(),
    neighborhood: z.string().trim().min(1, 'Informe o bairro'),
    city: z.string().trim().min(1, 'Informe a cidade'),
    state: z.string().trim().length(2, 'UF'),
  })
  .refine((d) => d.password === d.password_confirm, { message: 'As senhas não conferem', path: ['password_confirm'] })

export type RegisterForm = z.infer<typeof registerSchema>

export type CepLookup = { cep: string; street?: string; neighborhood?: string; city?: string; state?: string }
