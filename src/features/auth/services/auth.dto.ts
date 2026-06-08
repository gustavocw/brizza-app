import { z } from 'zod'
import type { User } from '@/shared/stores/auth.store'

/** Login form. `identifier` is e-mail OR phone (the backend's `/auth/login` rule). */
export const signInSchema = z.object({
  identifier: z.string().trim().min(1, 'Informe seu e-mail ou telefone'),
  password: z.string().min(1, 'Informe sua senha'),
})

export type SignInForm = z.infer<typeof signInSchema>

/** Mirrors the backend `User` (AuthResponse.user from POST /auth/login). */
export type BackendUser = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: 'USER' | 'ADMIN'
  email_verified: boolean
  phone_verified: boolean
  coverage_deposit_paid: boolean
  cpf_masked?: string
  photo_url?: string | null
  created_at: string
}

export type AuthResponse = {
  access_token: string
  refresh_token: string
  user: BackendUser
}

/** Backend user → the app's auth-store User. */
export function toAppUser(u: BackendUser): User {
  return {
    id: u.id,
    name: `${u.first_name} ${u.last_name}`.trim(),
    email: u.email,
  }
}
