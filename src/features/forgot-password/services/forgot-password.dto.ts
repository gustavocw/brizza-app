import { z } from 'zod'

// Step 1: ask for a code. The backend wants email XOR phone (we detect by '@').
export const requestSchema = z.object({
  identifier: z.string().trim().min(1, 'Informe seu e-mail ou telefone'),
})
export type RequestForm = z.infer<typeof requestSchema>

// Step 2: reset with the 6-digit code + new password.
export const resetSchema = z
  .object({
    code: z.string().regex(/^\d{6}$/, 'Código de 6 dígitos'),
    new_password: z.string().min(8, 'Mínimo de 8 caracteres'),
    confirm: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((d) => d.new_password === d.confirm, { message: 'As senhas não conferem', path: ['confirm'] })
export type ResetForm = z.infer<typeof resetSchema>

export const isEmail = (s: string) => s.includes('@')
