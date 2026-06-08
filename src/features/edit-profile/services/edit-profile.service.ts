import { apiGet, apiPut } from '@/lib/api'
import type { CepLookup } from './edit-profile.dto'

type Address = {
  zip: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}
type UpdateBody = { first_name: string; last_name: string; address: Address }

/**
 * Profile edit + CEP lookup.
 *   PUT /user/me (UpdateProfileRequest) → User
 *   GET /address/lookup/{cep} → ViaCEP proxy (street/neighborhood/city/state)
 */
export const EditProfileService = {
  update: (body: UpdateBody) => apiPut<UpdateBody, unknown>('/user/me', body),
  lookupCep: (cep: string) => apiGet<void, CepLookup>(`/address/lookup/${cep}`),
}
