// Mirrors the Brizze API `Session` schema (GET /auth/sessions).
export type Session = {
  id: string
  user_agent: string
  ip: string
  created_at: string
  last_used_at: string
  current: boolean
}

/** Rough device label from the user agent. */
export function deviceLabel(ua: string): string {
  if (/iPhone/i.test(ua)) return 'iPhone'
  if (/iPad/i.test(ua)) return 'iPad'
  if (/Android/i.test(ua)) return 'Android'
  if (/Macintosh|Mac OS/i.test(ua)) return 'Mac'
  if (/Windows/i.test(ua)) return 'Windows'
  if (/curl|PostmanRuntime|okhttp/i.test(ua)) return 'API'
  return ua.split('/')[0]?.slice(0, 24) || 'Dispositivo'
}

/** Short relative time ("agora", "5 min", "2 h", "3 d", "12 abr"). */
export function relTime(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const s = Math.max(0, Math.floor((Date.now() - then) / 1000))
  if (s < 60) return 'agora'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} h`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} d`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
