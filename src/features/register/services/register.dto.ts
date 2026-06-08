import { z } from 'zod'

// Mirrors RegisterRequest. Address is flattened in the form and rebuilt on submit.
export const registerSchema = z
  .object({
    first_name: z.string().trim().min(2, 'Mínimo de 2 caracteres'),
    last_name: z.string().trim().min(2, 'Mínimo de 2 caracteres'),
    email: z.string().trim().email('E-mail inválido'),
    phone: z.string().trim().min(10, 'Telefone inválido'),
    cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
    password: z.string().min(8, 'Mínimo de 8 caracteres'),
    password_confirm: z.string().min(1, 'Confirme a senha'),
    zip: z.string().regex(/^\d{8}$/, 'CEP de 8 dígitos'),
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
