import { z } from 'zod'

export const undeleteSchema = z.object({
  identifier: z.string().trim().min(1, 'Informe seu e-mail ou telefone'),
  password: z.string().min(1, 'Informe sua senha'),
})
export type UndeleteForm = z.infer<typeof undeleteSchema>
