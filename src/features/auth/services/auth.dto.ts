import { z } from 'zod'
import type { User } from '@/shared/stores/auth.store'
import { isValidCpf } from '../utils/cpf'

/** Login form schema — the source of truth for CPF + senha validation. */
export const signInSchema = z.object({
  cpf: z.string().min(1, 'Informe seu CPF').refine(isValidCpf, 'CPF inválido'),
  password: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
})

export type SignInForm = z.infer<typeof signInSchema>

export type SocialProvider = 'google' | 'apple'

/** Discriminated input for the sign-in mutation (CPF+senha or a social provider). */
export type SignInVars =
  | { method: 'cpf'; cpf: string; password: string }
  | { method: SocialProvider }

/** What a successful authentication returns (mirrors the future GoBrisa /auth payload). */
export type AuthResult = {
  token: string
  user: User
}
