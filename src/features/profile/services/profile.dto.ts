// Contract for the signed-in user. Mirrors the Brizze API `User` schema returned
// by `GET /user/me` (see apidocs/openapi.yaml). Kept in the feature because the
// profile screen is the only place that reads the full shape.

export type Address = {
  zip?: string
  street?: string
  number?: string
  complement?: string
  neighborhood?: string
  city?: string
  state?: string
}

export type Profile = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  cpf_masked?: string
  role: 'USER' | 'ADMIN'
  email_verified: boolean
  phone_verified: boolean
  coverage_deposit_paid: boolean
  photo_url?: string | null
  address?: Address | null
  terms_version_accepted?: string | null
  privacy_version_accepted?: string | null
  created_at: string
}

/** Body for `DELETE /user/me` — the password re-confirms intent (anti-accident). */
export type DeleteAccountForm = { password: string }

export const fullName = (p?: Pick<Profile, 'first_name' | 'last_name'>) =>
  p ? `${p.first_name} ${p.last_name}`.trim() : ''
