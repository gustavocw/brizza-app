// Normalizers for inconsistent list/pagination payload shapes.

/** Accepts a bare array or `{ data: [] }` and always returns the array. */
export function extractList<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object' && Array.isArray((raw as any).data)) {
    return (raw as any).data as T[]
  }
  return []
}

export type PageMeta = { total: number; page: number; limit: number; totalPages: number }

/** Normalizes `{ total }` vs `{ meta: { total, page, limit } }` pagination shapes. */
export function extractMeta(raw: unknown, fallbackLimit = 20): PageMeta {
  const obj = (raw ?? {}) as any
  const meta = obj.meta ?? obj
  const total = Number(meta.total ?? 0)
  const limit = Number(meta.limit ?? fallbackLimit)
  const page = Number(meta.page ?? 1)
  const totalPages = Number(meta.totalPages ?? Math.max(1, Math.ceil(total / limit)))
  return { total, page, limit, totalPages }
}
