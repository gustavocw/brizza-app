// Contract for notification preferences. Mirrors the Brizze API
// `NotificationPreferences` schema (GET/PUT /user/me/notification-preferences).

export type NotificationPreferences = {
  battery_low: boolean
  battery_full: boolean
  charging: boolean
  movement: boolean
  marketing: boolean
}

export type PrefKey = keyof NotificationPreferences

/** Display order + copy for each toggle. */
export const PREF_ITEMS: { key: PrefKey; label: string; sub: string }[] = [
  { key: 'battery_low', label: 'Bateria baixa', sub: 'Quando a carga estiver acabando' },
  { key: 'battery_full', label: 'Bateria cheia', sub: 'Quando terminar de carregar' },
  { key: 'charging', label: 'Carregamento', sub: 'Início e fim da recarga' },
  { key: 'movement', label: 'Movimento', sub: 'Se a moto se mover estacionada' },
  { key: 'marketing', label: 'Novidades e ofertas', sub: 'Promoções da Brizze' },
]
