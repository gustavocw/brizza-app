import { apiPost } from '@/lib/api'
import type { AuthResponse, SignInForm } from './auth.dto'

/**
 * Auth service. Functions return ApiResponse<R> (never throw); the query hooks
 * unwrap. Contract: Brizze API `POST /auth/login` ({ identifier, password }).
 */
export const AuthService = {
  signIn: (body: SignInForm) => apiPost<SignInForm, AuthResponse>('/auth/login', body),
  /** Google login: send the native idToken. `POST /auth/google` ({ id_token }). */
  googleSignIn: (idToken: string) => apiPost<{ id_token: string }, AuthResponse>('/auth/google', { id_token: idToken }),
  /** Revoke the current refresh token server-side. `POST /auth/logout` ({ refresh_token }). */
  logout: (refreshToken: string) => apiPost<{ refresh_token: string }, void>('/auth/logout', { refresh_token: refreshToken }),
}
