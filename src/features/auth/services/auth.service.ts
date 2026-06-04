import type { ApiResponse } from '@/lib/api'
import type { AuthResult, SignInVars } from './auth.dto'

// ─────────────────────────────────────────────────────────────────────────────
// MOCKED auth. There is no backend wired yet, so each method simulates latency
// and returns a canned session. The ApiResponse shape already matches the rest
// of the app: to go live, replace each branch with the real call, e.g.
//   apiPost<{ cpf: string; password: string }, AuthResult>('/auth', body)
// and delete the mock — nothing else (hooks, store, navigation) has to change.
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_USER: Record<SignInVars['method'], AuthResult['user']> = {
  cpf: { id: 'usr_mock_cpf', name: 'João Carlos Silva', email: 'joao@email.com' },
  google: { id: 'usr_mock_google', name: 'João Carlos Silva', email: 'joao@gmail.com' },
  apple: { id: 'usr_mock_apple', name: 'João Carlos Silva', email: 'joao@privaterelay.appleid.com' },
}

export const AuthService = {
  /** Mocked sign-in. Always succeeds after a short delay. */
  async signIn(vars: SignInVars): Promise<ApiResponse<AuthResult>> {
    await delay(vars.method === 'cpf' ? 900 : 1100)
    return {
      success: true,
      data: {
        token: `mock-token-${vars.method}`,
        user: MOCK_USER[vars.method],
      },
    }
  },
}
