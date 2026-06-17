// Contract for the API-served legal documents (`GET /legal/{kind}/current`).
// The field names are tolerant: the OpenAPI schema names them content/effective_at
// while the running API serves content_md/published_at — we accept either.

export type LegalKind = 'privacy' | 'terms'

export type LegalDocument = {
  kind?: LegalKind
  version?: string
  title?: string
  content?: string
  content_md?: string
  effective_at?: string
  published_at?: string
}

export const legalBody = (d?: LegalDocument) => d?.content_md ?? d?.content ?? ''

// A fixed, accented nav title per kind — cleaner than the backend's raw title
// (e.g. "Politica de Privacidade - Brizze"); the document's own H1 still renders
// inside the body.
export const legalTitle = (kind: LegalKind) => (kind === 'privacy' ? 'Política de Privacidade' : 'Termos de Uso')
