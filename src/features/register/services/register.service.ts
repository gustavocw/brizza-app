import { apiGet, apiPost } from '@/lib/api'
import type { AuthResponse } from '@/features/auth/services/auth.dto'
import type { CepLookup } from './register.dto'

type Address = {
  zip: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}
type RegisterBody = {
  first_name: string
  last_name: string
  email: string
  phone: string
  cpf: string
  password: string
  password_confirm: string
  address: Address
}

/** Sign up. POST /auth/register → AuthResponse (tokens + user). Public. */
export const RegisterService = {
  register: (body: RegisterBody) => apiPost<RegisterBody, AuthResponse>('/auth/register', body),
  lookupCep: (cep: string) => apiGet<void, CepLookup>(`/address/lookup/${cep}`),
}
