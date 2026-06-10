import { z } from 'zod'

export type VerifyKind = 'email' | 'phone'

export const codeSchema = z.object({ code: z.string().regex(/^\d{6}$/, 'Código de 6 dígitos') })
export type CodeForm = z.infer<typeof codeSchema>

export const VERIFY: Record<VerifyKind, { title: string; target: string; done: string }> = {
  email: { title: 'Verificar e-mail', target: 'o seu e-mail', done: 'E-mail verificado!' },
  phone: { title: 'Verificar telefone', target: 'o seu telefone', done: 'Telefone verificado!' },
}
