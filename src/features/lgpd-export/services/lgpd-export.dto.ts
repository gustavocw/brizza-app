// Shape of GET /user/me/export (alias of /user/me/lgpd-export): the user's full
// personal data, returned as inline JSON (LGPD Art. 18). Typed loosely on purpose,
// the screen only saves/shares the raw payload, it does not render every field.

export type LgpdExport = {
  generated_at: string
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
    cpf: string
    photo_url?: string | null
    role: string
    email_verified: boolean
    phone_verified: boolean
    coverage_deposit_paid: boolean
    created_at: string
    updated_at: string
  }
  address: {
    zip: string
    street: string
    number: string
    complement?: string | null
    neighborhood: string
    city: string
    state: string
  } | null
  notification_preferences: {
    battery_low: boolean
    battery_full: boolean
    charging: boolean
    movement: boolean
    marketing: boolean
  }
  terms_acceptances: {
    terms_version: string
    privacy_version: string
    accepted_at: string
    ip?: string | null
    user_agent?: string | null
  }[]
  sessions: {
    id: string
    device_info?: string | null
    ip?: string | null
    user_agent?: string | null
    issued_at: string
    last_seen_at: string
    expires_at: string
    revoked_at?: string | null
  }[]
  login_attempts: {
    at: string
    ip?: string | null
    user_agent?: string | null
    success: boolean
    reason?: string | null
  }[]
}

/** Filename for the shared/saved export. Date-stamped, no separators in prose. */
export const exportFileName = () => `brizza-meus-dados-${new Date().toISOString().slice(0, 10)}.json`
