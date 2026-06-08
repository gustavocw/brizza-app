import { z } from 'zod'

// Body for PUT /user/me/password ({ current_password, new_password }); `confirm`
// is client-side only.
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, 'Informe sua senha atual'),
    new_password: z.string().min(8, 'Mínimo de 8 caracteres'),
    confirm: z.string().min(1, 'Confirme a nova senha'),
  })
  .refine((d) => d.new_password === d.confirm, { message: 'As senhas não conferem', path: ['confirm'] })

export type ChangePasswordForm = z.infer<typeof changePasswordSchema>
